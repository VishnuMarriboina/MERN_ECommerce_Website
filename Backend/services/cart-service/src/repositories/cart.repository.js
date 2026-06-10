const Cart = require("../models/cart.model");

const findByUserId = (userId) => Cart.findOne({ userId }).lean();
const findByUserIdRaw = (userId) => Cart.findOne({ userId });
const findItemInCart = (userId, productId, variantId) =>
  Cart.findOne({ userId, "items.productId": productId, "items.variantId": variantId }, { "items.$": 1 });
const findItemById = (userId, cartItemId) =>
  Cart.findOne({ userId, "items._id": cartItemId }, { "items.$": 1 });
const upsertCart = (userId) =>
  Cart.updateOne({ userId }, { $setOnInsert: { userId, items: [] } }, { upsert: true });
const incrementItemQty = (userId, productId, variantId, quantity) =>
  Cart.updateOne({ userId, "items.productId": productId, "items.variantId": variantId }, { $inc: { "items.$.quantity": quantity } });
const pushItem = (userId, item) => Cart.updateOne({ userId }, { $push: { items: item } });
const setItemQty = (userId, cartItemId, quantity) =>
  Cart.updateOne({ userId, "items._id": cartItemId }, { $set: { "items.$.quantity": quantity } });
const removeItem = (userId, cartItemId) =>
  Cart.updateOne({ userId }, { $pull: { items: { _id: cartItemId } } });
const clearItems = (userId) => Cart.updateOne({ userId }, { $set: { items: [] } });

module.exports = {
  findByUserId, findByUserIdRaw, findItemInCart, findItemById,
  upsertCart, incrementItemQty, pushItem, setItemQty, removeItem, clearItems,
};
