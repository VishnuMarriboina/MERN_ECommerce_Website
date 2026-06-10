const express = require("express");
const router = express.Router();
const { getStock, getProduct, decrementStock, incrementPurchaseCount } = require("../../controllers/internal/internal.controller");

router.get("/stock/:model/:productId/:variantId", getStock);
router.get("/products/:model/:id", getProduct);
router.put("/stock/decrement", decrementStock);
router.put("/purchase/increment", incrementPurchaseCount);

module.exports = router;
