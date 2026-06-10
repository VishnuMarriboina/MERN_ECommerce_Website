const express = require("express");
const router = express.Router();
const { createProxy } = require("../services/proxy.service");
const { createBalancer } = require("../utils/loadBalancer");

const balancer = createBalancer(
  process.env.ORDER_SERVICE_URLS || "http://localhost:3004"
);

router.use("/orders", createProxy(balancer));

module.exports = router;
