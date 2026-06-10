const express = require("express");
const router = express.Router();
const { getCartByUserId, clearCartByUserId } = require("../../controllers/internal/internal.controller");

router.get("/cart/:userId", getCartByUserId);
router.delete("/cart/:userId/clear", clearCartByUserId);

module.exports = router;
