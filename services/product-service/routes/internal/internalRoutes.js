const express = require("express");
const router = express.Router();
const { getStock, getProduct, decrementStock } = require("../../controllers/internal/internalController");

router.get("/stock/:model/:productId/:variantId", getStock);
router.get("/products/:model/:id", getProduct);
router.put("/stock/decrement", decrementStock);

module.exports = router;
