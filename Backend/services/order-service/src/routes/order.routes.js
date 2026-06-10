const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/auth.middleware");
const { getMyOrders, updateOrderStatus, cancelOrder, getAllOrdersForAdmin, getAdminDashboardStats } = require("../controllers/order.controller");

router.get("/stats", authMiddleware, getAdminDashboardStats);
router.get("/my-orders", authMiddleware, getMyOrders);
router.get("/all", authMiddleware, getAllOrdersForAdmin);
router.put("/update-status/:id", authMiddleware, updateOrderStatus);
router.put("/cancel-order/:orderId", authMiddleware, cancelOrder);

module.exports = router;
