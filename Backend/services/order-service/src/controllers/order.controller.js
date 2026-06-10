const orderService = require("../services/order.service");
const ORDER_MSGS = require("../constants/order.messages");

const getMyOrders = async (req, res) => {
  try {
    const result = await orderService.getMyOrders(req.user.userId);
    res.status(200).json(result);
  } catch (error) { res.status(error.status || 500).json({ error: error.message }); }
};

const getAllOrdersForAdmin = async (req, res) => {
  try {
    const result = await orderService.getAllOrdersForAdmin(req.user.userId);
    res.status(200).json(result);
  } catch (error) { res.status(error.status || 500).json({ error: error.message }); }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
    res.status(200).json({ message: ORDER_MSGS.STATUS_UPDATED, order });
  } catch (error) { res.status(error.status || 500).json({ error: error.message }); }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await orderService.cancelOrder(req.params.orderId, req.user.userId, req.user.role);
    res.status(200).json({ message: ORDER_MSGS.CANCELLED, order });
  } catch (error) { res.status(error.status || 500).json({ error: error.message }); }
};

const getAdminDashboardStats = async (req, res) => {
  try {
    const result = await orderService.getAdminDashboardStats();
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

module.exports = { getMyOrders, getAllOrdersForAdmin, updateOrderStatus, cancelOrder, getAdminDashboardStats };
