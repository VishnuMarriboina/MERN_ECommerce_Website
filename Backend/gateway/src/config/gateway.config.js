// Downstream services on Render's free tier hibernate after ~15 min idle and
// respond 429/502/503/504 (instead of transparently waking) when the gateway
// calls them server-to-server. Real cold starts commonly take 10-30s, so a
// single short retry usually lands mid-wake — retry a few times with backoff
// (3s, 6s, 12s ≈ 21s worst case) to give the instance a real chance to be up.
const RETRYABLE_STATUS_CODES = new Set([429, 502, 503, 504]);
const DEFAULT_RETRY_DELAYS_MS = [3000, 6000, 12000];
const RETRY_DELAYS_MS = process.env.PROXY_RETRY_DELAYS_MS
  ? process.env.PROXY_RETRY_DELAYS_MS.split(",").map(Number).filter((n) => Number.isFinite(n) && n > 0)
  : DEFAULT_RETRY_DELAYS_MS;
const PROXY_TIMEOUT_MS = Number(process.env.PROXY_TIMEOUT_MS) || 10000;

// Headers copied straight through from the downstream response that would be
// misleading once we've replaced the body with our own gateway-timeout message
// (e.g. Render's own "hibernate-rate-limited" routing/edge headers).
const STALE_PASSTHROUGH_HEADERS = ["x-render-routing", "x-render-origin-server"];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sendGatewayTimeout = (userRes) => {
  STALE_PASSTHROUGH_HEADERS.forEach((h) => userRes.removeHeader(h));
  userRes.setHeader("content-type", "application/json");
  userRes.status(504);
  return Buffer.from(JSON.stringify({
    success: false,
    message: "Gateway timeout: the downstream service didn't respond in time. Please try again shortly.",
  }));
};

const buildForwardHeaders = (req) => {
  const headers = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (["host", "connection", "content-length"].includes(key.toLowerCase())) continue;
    if (value === undefined) continue;
    headers[key] = Array.isArray(value) ? value.join(", ") : value;
  }
  return headers;
};

const retryProxyRequest = async (req) => {
  const url = `${req.proxyTarget}${req.originalUrl}`;
  const hasBody = Buffer.isBuffer(req.body) && req.body.length > 0 && !["GET", "HEAD"].includes(req.method);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROXY_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: buildForwardHeaders(req),
      body: hasBody ? req.body : undefined,
      signal: controller.signal,
    });

    return {
      statusCode: response.status,
      contentType: response.headers.get("content-type"),
      buffer: Buffer.from(await response.arrayBuffer()),
    };
  } finally {
    clearTimeout(timer);
  }
};

module.exports = {
  authServiceUrl: process.env.AUTH_SERVICE_URL || "http://localhost:3001",
  productServiceUrl: process.env.PRODUCT_SERVICE_URL || "http://localhost:3002",
  cartServiceUrl: process.env.CART_SERVICE_URL || "http://localhost:3003",
  orderServiceUrl: process.env.ORDER_SERVICE_URL || "http://localhost:3004",
  proxyOptions: {
    parseReqBody: true,
    timeout: PROXY_TIMEOUT_MS,
    proxyReqPathResolver: (req) => req.originalUrl,
    // express-http-proxy's default error handler writes a bare, empty 504 on a
    // socket timeout (see its connectionResetHandler) — replace it with a JSON
    // body consistent with the rest of the gateway's error responses.
    proxyErrorHandler: (err, res, next) => {
      const isTimeout = err && ["ECONNRESET", "ECONNABORTED", "ETIMEDOUT"].includes(err.code);
      if (!isTimeout) return next(err);
      if (res.headersSent) return;
      res.status(504).json({
        success: false,
        message: "Gateway timeout: the downstream service didn't respond in time. Please try again shortly.",
      });
    },
    userResHeaderDecorator: (headers, userReq, userRes) => {
      const corsHeaders = [
        "access-control-allow-origin",
        "access-control-allow-credentials",
        "access-control-allow-methods",
        "access-control-allow-headers",
      ];
      corsHeaders.forEach((h) => {
        delete headers[h];
        const val = userRes.getHeader(h);
        if (val) headers[h] = val;
      });
      return headers;
    },
    userResDecorator: async (proxyRes, proxyResData, userReq, userRes) => {
      let statusCode = proxyRes.statusCode;
      let resultData = proxyResData;
      let retriesExhaustedByTimeout = false;

      for (
        let attempt = 0;
        attempt < RETRY_DELAYS_MS.length && RETRYABLE_STATUS_CODES.has(statusCode);
        attempt++
      ) {
        await delay(RETRY_DELAYS_MS[attempt]);
        try {
          const retryResult = await retryProxyRequest(userReq);
          statusCode = retryResult.statusCode;
          resultData = retryResult.buffer;
          if (retryResult.contentType) userRes.setHeader("content-type", retryResult.contentType);
        } catch (_err) {
          retriesExhaustedByTimeout = true;
          break;
        }
      }

      // Downstream never recovered (still a retryable status, or the last retry
      // itself timed out) — surface a clear gateway-timeout message instead of
      // forwarding whatever error page/status the downstream/Render edge sent.
      if (retriesExhaustedByTimeout || RETRYABLE_STATUS_CODES.has(statusCode)) {
        return sendGatewayTimeout(userRes);
      }

      userRes.status(statusCode);
      return resultData;
    },
  },
};
