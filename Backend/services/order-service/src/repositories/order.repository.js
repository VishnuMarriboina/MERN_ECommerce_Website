const mongoose = require("mongoose");
const Orders = require("../models/order.model");

const findByUserId = (userId) => Orders.find({ userId }).sort({ orderedDate: -1 });
const findByAdminId = (adminId) =>
  Orders.find({ "items.addedBy": new mongoose.Types.ObjectId(adminId) }).sort({ orderedDate: -1 });
const findById = (id) => Orders.findById(id);
const create = (data) => Orders.create(data);

const getAdminStats = async () => {
  const [totals] = await Orders.aggregate([
    { $match: { status: { $ne: "Cancelled" } } },
    { $group: { _id: null, revenue: { $sum: "$totalAmount" } } },
  ]);

  const totalOrders = await Orders.countDocuments({});

  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 5);
  cutoff.setDate(1);
  cutoff.setHours(0, 0, 0, 0);

  const monthlySales = await Orders.aggregate([
    { $match: { orderedDate: { $gte: cutoff }, status: { $ne: "Cancelled" } } },
    {
      $group: {
        _id: { year: { $year: "$orderedDate" }, month: { $month: "$orderedDate" } },
        revenue: { $sum: "$totalAmount" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const statusAgg = await Orders.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const categoryAgg = await Orders.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.productModel",
        revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        quantity: { $sum: "$items.quantity" },
      },
    },
    { $sort: { revenue: -1 } },
  ]);

  const topProducts = await Orders.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.productId",
        brand: { $first: "$items.details.brand" },
        model: { $first: "$items.productModel" },
        quantity: { $sum: "$items.quantity" },
        revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
      },
    },
    { $sort: { quantity: -1 } },
    { $limit: 5 },
  ]);

  const recentOrders = await Orders.find({}).sort({ orderedDate: -1 }).limit(5).lean();

  return {
    totalRevenue: totals?.revenue || 0,
    totalOrders,
    monthlySales,
    statusBreakdown: Object.fromEntries(statusAgg.map((s) => [s._id, s.count])),
    categoryBreakdown: categoryAgg.map((c) => ({ model: c._id, revenue: c.revenue, quantity: c.quantity })),
    topProducts: topProducts.map((p) => ({ id: p._id, brand: p.brand, model: p.model, quantity: p.quantity, revenue: p.revenue })),
    recentOrders,
  };
};

module.exports = { findByUserId, findByAdminId, findById, create, getAdminStats };
