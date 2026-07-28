const proxy = require("express-http-proxy");
const { proxyOptions } = require("../config/gateway.config");

// balancer: object with .next() that returns the next target URL (round-robin)
// The resolved target is stashed on req so a retry (see userResDecorator) can
// re-issue the request against the same downstream instance.
const createProxy = (balancer) =>
  proxy((req) => {
    req.proxyTarget = balancer.next();
    return req.proxyTarget;
  }, proxyOptions);

module.exports = { createProxy };
