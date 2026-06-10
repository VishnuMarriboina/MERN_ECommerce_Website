const express = require("express");
const router = express.Router();
const { createProxy } = require("../services/proxy.service");
const { createBalancer } = require("../utils/loadBalancer");

const balancer = createBalancer(
  process.env.PRODUCT_SERVICE_URLS || "http://localhost:3002"
);

router.use("/clothes", createProxy(balancer));
router.use("/accessories", createProxy(balancer));
router.use("/footwear", createProxy(balancer));
router.use("/products", createProxy(balancer));

module.exports = router;
