const express = require("express");
const router = express.Router();
const { createOrderInternal } = require("../../controllers/internal/internal.controller");

router.post("/orders", createOrderInternal);

module.exports = router;
