const createProductRepository = require("./product.repository");
const { GenericProduct } = require("../models/generic.model");

const genericRepo = {
  ...createProductRepository(GenericProduct),
  findOne:        (filter) => GenericProduct.findOne(filter),
  findByCategory: (category) => GenericProduct.find({ category: new RegExp(`^${category}$`, "i") }),
};

module.exports = genericRepo;
