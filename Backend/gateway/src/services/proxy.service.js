const proxy = require("express-http-proxy");
const { proxyOptions } = require("../config/gateway.config");

// balancer: object with .next() that returns the next target URL (round-robin)
const createProxy = (balancer) => proxy(() => balancer.next(), proxyOptions);

module.exports = { createProxy };
