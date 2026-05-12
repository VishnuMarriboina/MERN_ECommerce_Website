const Orders = require("../../models/orders");

// POST /internal/orders
// Called by cart-service after a successful checkout to create the order record
const createOrderInternal = async (req, res) => {
  try {
    const order = await Orders.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createOrderInternal };
