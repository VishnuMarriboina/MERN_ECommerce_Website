const { GenericProduct } = require("../models/generic.model");

const getLowStockProducts = async (threshold = 5) => {
  const products = await GenericProduct.find({ "variants.count": { $lte: threshold } });
  return products.map((p) => ({ model: "generic", product: p }));
};

module.exports = { getLowStockProducts };
