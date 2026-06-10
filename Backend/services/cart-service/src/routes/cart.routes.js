const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/auth.middleware");
const { addToCart, getCart, updateCartQty, removeFromCart, clearCart, buyAll } = require("../controllers/cart.controller");

router.post("/add", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);
router.put("/update-qty", authMiddleware, updateCartQty);
router.delete("/remove", authMiddleware, removeFromCart);
router.delete("/clear", authMiddleware, clearCart);
router.post("/buy-all", authMiddleware, buyAll);

module.exports = router;
