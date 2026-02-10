const express = require("express");
const router = express.Router();
const {
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getAllOrdersForAdmin,
} = require("../../controllers/orders/orderController");

const {
  authMiddleware,
  authorizeRoles,
} = require("../../middlewear/authMiddlewear");

router.get("/my-orders", authMiddleware, getMyOrders);
router.get(
  "/all",
  authMiddleware,
  //  authorizeRoles("admin"),
  getAllOrdersForAdmin
);
router.put(
  "/update-status/:id",
  authMiddleware,
  //  authorizeRoles("admin"),
  updateOrderStatus
);
router.put("/cancel-order/:id", authMiddleware, cancelOrder);

module.exports = router;
