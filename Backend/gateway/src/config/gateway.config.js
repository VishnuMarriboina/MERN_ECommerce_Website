module.exports = {
  authServiceUrl: process.env.AUTH_SERVICE_URL || "http://localhost:3001",
  productServiceUrl: process.env.PRODUCT_SERVICE_URL || "http://localhost:3002",
  cartServiceUrl: process.env.CART_SERVICE_URL || "http://localhost:3003",
  orderServiceUrl: process.env.ORDER_SERVICE_URL || "http://localhost:3004",
  proxyOptions: {
    parseReqBody: false,
    proxyReqPathResolver: (req) => req.originalUrl,
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
  },
};
