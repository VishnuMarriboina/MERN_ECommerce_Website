const express = require("express");
const router = express.Router();
const { createProxy } = require("../services/proxy.service");
const { createBalancer } = require("../utils/loadBalancer");

const balancer = createBalancer(
  process.env.CART_SERVICE_URLS || "http://localhost:3003"
);

router.use("/cart", createProxy(balancer));

module.exports = router;
