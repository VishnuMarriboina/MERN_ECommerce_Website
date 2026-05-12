const Cart = require("../../models/Cart");

// GET /internal/cart/:userId
const getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).lean();
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /internal/cart/:userId/clear
const clearCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    await Cart.updateOne({ userId }, { $set: { items: [] } });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getCartByUserId, clearCartByUserId };
