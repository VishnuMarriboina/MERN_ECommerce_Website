const calculateCartTotal = (items) =>
  items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

module.exports = { calculateCartTotal };
