const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewear/authMiddlewear");
const { addToCart, getCart, updateCartQty, removeFromCart, clearCart, buyAllCartItems } = require("../controllers/cartController");

router.post("/add", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);
router.put("/update-qty", authMiddleware, updateCartQty);
router.delete("/remove", authMiddleware, removeFromCart);
router.delete("/clear", authMiddleware, clearCart);
router.post("/buy-all", authMiddleware, buyAllCartItems);

module.exports = router;
