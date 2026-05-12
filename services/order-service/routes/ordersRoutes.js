const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewear/authMiddlewear");
const { getMyOrders, updateOrderStatus, cancelOrder, getAllOrdersForAdmin } = require("../controllers/orderController");

router.get("/my-orders", authMiddleware, getMyOrders);
router.get("/all", authMiddleware, getAllOrdersForAdmin);
router.put("/update-status/:id", authMiddleware, updateOrderStatus);
router.put("/cancel-order/:orderId", authMiddleware, cancelOrder);

module.exports = router;
