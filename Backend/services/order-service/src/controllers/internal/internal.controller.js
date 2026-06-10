const orderService = require("../../services/order.service");

const createOrderInternal = async (req, res) => {
  try {
    const order = await orderService.createOrderInternal(req.body);
    res.status(201).json(order);
  } catch (err) { res.status(err.status || 500).json({ error: err.message }); }
};

module.exports = { createOrderInternal };
