const cartService = require("../services/cart.service");
const { buyAllCartItems } = require("../services/checkout.service");
const CART_MSGS = require("../constants/cart.messages");

const addToCart = async (req, res) => {
  try {
    const { productId, variantId, productModel, quantity = 1 } = req.body;
    if (!productId || !variantId || !productModel) return res.status(400).json({ error: CART_MSGS.MISSING_FIELDS });
    const cart = await cartService.addToCart(req.user.userId, productId, variantId, productModel, quantity);
    return res.status(200).json({ message: CART_MSGS.ADDED_TO_CART, cart });
  } catch (err) { return res.status(err.status || 500).json({ error: err.message }); }
};

const getCart = async (req, res) => {
  try {
    const cart = await cartService.getCart(req.user.userId);
    res.json(cart);
  } catch (err) { res.status(err.status || 500).json({ error: err.message }); }
};

const updateCartQty = async (req, res) => {
  try {
    const cart = await cartService.updateCartQty(req.user.userId, req.body.cartItemId, req.body.quantity);
    res.json({ message: CART_MSGS.QUANTITY_UPDATED, cart });
  } catch (err) { res.status(err.status || 500).json({ error: err.message }); }
};

const removeFromCart = async (req, res) => {
  try {
    await cartService.removeFromCart(req.user.userId, req.body.cartItemId);
    res.json({ message: CART_MSGS.ITEM_REMOVED });
  } catch (err) { res.status(err.status || 500).json({ error: err.message }); }
};

const clearCart = async (req, res) => {
  try {
    await cartService.clearCart(req.user.userId);
    res.json({ message: CART_MSGS.CART_CLEARED });
  } catch (err) { res.status(err.status || 500).json({ error: err.message }); }
};

const buyAll = async (req, res) => {
  try {
    const order = await buyAllCartItems(req.user.userId, req.body.paymentType, req.body.paymentMode);
    res.json({ message: CART_MSGS.ORDER_PLACED, order });
  } catch (err) { res.status(err.status || 500).json({ error: err.message }); }
};

module.exports = { addToCart, getCart, updateCartQty, removeFromCart, clearCart, buyAll };
