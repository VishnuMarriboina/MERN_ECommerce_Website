const applyDiscount = (price, discountPercent) => price - (price * discountPercent) / 100;
const calculateTax = (price, taxRate = 0.18) => price * taxRate;

module.exports = { applyDiscount, calculateTax };
