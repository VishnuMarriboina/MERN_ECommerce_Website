const orderRepository = require("../repositories/order.repository");
const ORDER_STATUS = require("../constants/orderStatus");
const ORDER_MSGS = require("../constants/order.messages");
const ROLES = require("@ecommerce/shared/src/constants/roles");

const getMyOrders = async (userId) => {
  const orders = await orderRepository.findByUserId(userId);
  return { count: orders.length, orders };
};

const getAllOrdersForAdmin = async (adminId) => {
  const orders = await orderRepository.findByAdminId(adminId);
  return { count: orders.length, orders };
};

const updateOrderStatus = async (orderId, status) => {
  if (!ORDER_STATUS.VALID_STATUSES.includes(status)) { const err = new Error(ORDER_MSGS.INVALID_STATUS); err.status = 400; throw err; }
  const order = await orderRepository.findById(orderId);
  if (!order) { const err = new Error(ORDER_MSGS.NOT_FOUND); err.status = 404; throw err; }
  if (order.status === ORDER_STATUS.DELIVERED) { const err = new Error(ORDER_MSGS.CANNOT_UPDATE_DELIVERED); err.status = 400; throw err; }

  if (!order.history) order.history = [];
  order.history.push({ from: order.status, to: status, changedAt: new Date() });
  order.status = status;
  await order.save();
  return order;
};

const cancelOrder = async (orderId, userId, role) => {
  const order = await orderRepository.findById(orderId);
  if (!order) { const err = new Error(ORDER_MSGS.NOT_FOUND); err.status = 404; throw err; }
  if (order.userId.toString() !== userId.toString() && role !== ROLES.ADMIN) {
    const err = new Error(ORDER_MSGS.UNAUTHORIZED); err.status = 403; throw err;
  }
  if (order.status === ORDER_STATUS.DELIVERED) { const err = new Error(ORDER_MSGS.DELIVERED_CANNOT_CANCEL); err.status = 400; throw err; }
  if (order.status === ORDER_STATUS.CANCELLED) { const err = new Error(ORDER_MSGS.ALREADY_CANCELLED); err.status = 400; throw err; }

  if (!order.history) order.history = [];
  order.history.push({ from: order.status, to: ORDER_STATUS.CANCELLED, changedAt: new Date() });
  order.status = ORDER_STATUS.CANCELLED;
  await order.save();
  return order;
};

const createOrderInternal = (data) => orderRepository.create(data);

const getAdminDashboardStats = () => orderRepository.getAdminStats();

module.exports = { getMyOrders, getAllOrdersForAdmin, updateOrderStatus, cancelOrder, createOrderInternal, getAdminDashboardStats };
