const mongoose = require("mongoose");
const Orders = require("../models/orders");

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await Orders.find({ userId }).sort({ orderedDate: -1 });
    res.status(200).json({ count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders", details: error.message });
  }
};

const getAllOrdersForAdmin = async (req, res) => {
  try {
    const adminId = req.user.userId;
    const orders = await Orders.find({
      "items.addedBy": new mongoose.Types.ObjectId(adminId),
    }).sort({ orderedDate: -1 });
    res.status(200).json({ count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admin orders", details: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id: orderId } = req.params;
    const { status } = req.body;
    const validStatuses = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Orders.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.status === "Delivered") {
      return res.status(400).json({ error: "Cannot update a delivered order" });
    }

    if (!order.history) order.history = [];
    order.history.push({ from: order.status, to: status, changedAt: new Date() });
    order.status = status;
    await order.save();

    res.status(200).json({ message: "Status updated", order });
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status", details: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;

    const order = await Orders.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.userId.toString() !== userId.toString() && req.user.role !== "Admin") {
      return res.status(403).json({ error: "Unauthorized action" });
    }

    if (order.status === "Delivered") {
      return res.status(400).json({ error: "Delivered order cannot be cancelled" });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({ error: "Order already cancelled" });
    }

    if (!order.history) order.history = [];
    order.history.push({ from: order.status, to: "Cancelled", changedAt: new Date() });
    order.status = "Cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ error: "Failed to cancel order", details: error.message });
  }
};

module.exports = { getMyOrders, updateOrderStatus, cancelOrder, getAllOrdersForAdmin };
