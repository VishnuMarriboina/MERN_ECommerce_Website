const buildProxyOptions = (overrides = {}) => ({
  parseReqBody: false,
  proxyReqPathResolver: (req) => req.originalUrl,
  ...overrides,
});

module.exports = { buildProxyOptions };
