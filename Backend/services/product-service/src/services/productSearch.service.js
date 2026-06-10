const { GenericProduct } = require("../models/generic.model");

const searchProducts = async (query, limit = 20) => {
  const regex = new RegExp(query, "i");
  return GenericProduct.find({
    $or: [{ brand: regex }, { name: regex }, { category: regex }],
  }).limit(limit);
};

module.exports = { searchProducts };
