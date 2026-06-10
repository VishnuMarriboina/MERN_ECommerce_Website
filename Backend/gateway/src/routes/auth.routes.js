const express = require("express");
const router = express.Router();
const { createProxy } = require("../services/proxy.service");
const { createBalancer } = require("../utils/loadBalancer");

const balancer = createBalancer(
  process.env.AUTH_SERVICE_URLS || "http://localhost:3001"
);

router.use("/auth", createProxy(balancer));
router.use("/users", createProxy(balancer));
router.use("/contact", createProxy(balancer));

module.exports = router;
