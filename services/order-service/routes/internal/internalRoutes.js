const express = require("express");
const router = express.Router();
const { createOrderInternal } = require("../../controllers/internal/internalController");

router.post("/orders", createOrderInternal);

module.exports = router;
