const cartRepository = require("../../repositories/cart.repository");
const CART_MSGS = require("../../constants/cart.messages");

const getCartByUserId = async (req, res) => {
  try {
    const cart = await cartRepository.findByUserId(req.params.userId);
    res.json(cart || { items: [] });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const clearCartByUserId = async (req, res) => {
  try {
    await cartRepository.clearItems(req.params.userId);
    res.json({ message: CART_MSGS.CART_CLEARED });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { getCartByUserId, clearCartByUserId };
