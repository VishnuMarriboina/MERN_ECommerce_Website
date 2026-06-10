const genericRepo = require("../../repositories/generic.repository");
const { CategorySchemaModel } = require("../../models/categorySchema.model");
const MSGS = require("../../constants/product.messages");

const escRx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const nameRx = (s) => new RegExp(`^${escRx(s.trim())}$`, "i");

const regProduct = async (userId, { category, name, brand, description, attributes, variants }) => {
  const existing = await genericRepo.findOne({
    brand:    nameRx(brand),
    name:     nameRx(name),
    category: nameRx(category),
  });

  if (existing) {
    const err = new Error(MSGS.PRODUCT_EXISTS);
    err.status = 409;
    throw err;
  }

  const cleanedVariants = variants.map((v) => ({
    image_url:  v.image_url?.trim() || "No image found",
    cost:       v.cost,
    count:      v.count,
    attributes: v.attributes || {},
  }));

  return genericRepo.create({
    category:    category.trim(),
    name:        name.trim(),
    brand:       brand.trim(),
    description: description?.trim() || "",
    attributes:  attributes || {},
    variants:    cleanedVariants,
    addedBy:     userId,
  });
};

const getProductsByCategory = async (category) => {
  return genericRepo.findByCategory(category);
};

const updateGenericProduct = async (productId, data) => {
  if (!productId?.match(/^[0-9a-fA-F]{24}$/)) {
    const err = new Error(MSGS.INVALID_ID);
    err.status = 400;
    throw err;
  }
  const allowedFields = ["name", "brand", "description", "attributes"];
  const updateData = {};
  allowedFields.forEach((f) => { if (data[f] !== undefined) updateData[f] = data[f]; });

  const updated = await genericRepo.findByIdAndUpdate(productId, updateData, {
    new: true,
    runValidators: true,
  });
  if (!updated) {
    const err = new Error(MSGS.NOT_FOUND);
    err.status = 404;
    throw err;
  }
  return updated;
};

const deleteGenericProduct = async (productId) => {
  if (!productId?.match(/^[0-9a-fA-F]{24}$/)) {
    const err = new Error(MSGS.INVALID_ID);
    err.status = 400;
    throw err;
  }
  const deleted = await genericRepo.findByIdAndDelete(productId);
  if (!deleted) {
    const err = new Error(MSGS.NOT_FOUND);
    err.status = 404;
    throw err;
  }
};

const addVariant = async (productId, variantData) => {
  if (!productId?.match(/^[0-9a-fA-F]{24}$/)) {
    const err = new Error(MSGS.INVALID_ID);
    err.status = 400;
    throw err;
  }
  const product = await genericRepo.findById(productId);
  if (!product) {
    const err = new Error(MSGS.NOT_FOUND);
    err.status = 404;
    throw err;
  }
  if (variantData.cost === undefined || variantData.count === undefined) {
    const err = new Error(MSGS.REQUIRED_FIELDS);
    err.status = 400;
    throw err;
  }
  product.variants.push({
    image_url:  variantData.image_url?.trim() || "No image found",
    cost:       variantData.cost,
    count:      variantData.count,
    attributes: variantData.attributes || {},
  });
  return product.save();
};

const updateVariant = async (productId, variantId, data) => {
  const product = await genericRepo.findById(productId);
  if (!product) {
    const err = new Error(MSGS.NOT_FOUND);
    err.status = 404;
    throw err;
  }
  const variant = product.variants.id(variantId);
  if (!variant) {
    const err = new Error(MSGS.VARIANT_NOT_FOUND);
    err.status = 404;
    throw err;
  }
  if (data.cost  !== undefined) variant.cost  = data.cost;
  if (data.count !== undefined) variant.count = data.count;
  if (data.image_url !== undefined) variant.image_url = data.image_url?.trim() || "No image found";
  if (data.attributes && typeof data.attributes === "object") {
    // Replace attributes map entries
    for (const [k, v] of Object.entries(data.attributes)) variant.attributes.set(k, v);
    // Remove any keys no longer present
    for (const k of variant.attributes.keys()) {
      if (!(k in data.attributes)) variant.attributes.delete(k);
    }
  }
  return product.save();
};

const deleteVariant = async (productId, variantId) => {
  const product = await genericRepo.findById(productId);
  if (!product) {
    const err = new Error(MSGS.NOT_FOUND);
    err.status = 404;
    throw err;
  }
  const variant = product.variants.id(variantId);
  if (!variant) {
    const err = new Error(MSGS.VARIANT_NOT_FOUND);
    err.status = 404;
    throw err;
  }
  variant.deleteOne();
  return product.save();
};

/* ── Category Schema ─────────────────────────────────────────────── */

const defineCategorySchema = async (userId, { categoryName, fields, variantFields }) => {
  if (!categoryName?.trim()) {
    const err = new Error("categoryName is required");
    err.status = 400;
    throw err;
  }
  return CategorySchemaModel.findOneAndUpdate(
    { categoryName: nameRx(categoryName) },
    {
      categoryName:  categoryName.trim(),
      fields:        fields        || [],
      variantFields: variantFields || [],
      createdBy:     userId,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
  );
};

const getCategorySchema = async (categoryName) => {
  return CategorySchemaModel.findOne({ categoryName: nameRx(categoryName) });
};

const getAllCategorySchemas = async () => {
  return CategorySchemaModel.find({}).sort({ categoryName: 1 });
};

const deleteCategorySchema = async (categoryName) => {
  const deleted = await CategorySchemaModel.findOneAndDelete({ categoryName: nameRx(categoryName) });
  if (!deleted) {
    const err = new Error(MSGS.NOT_FOUND);
    err.status = 404;
    throw err;
  }
};

module.exports = {
  regProduct,
  getProductsByCategory,
  updateGenericProduct,
  deleteGenericProduct,
  addVariant,
  updateVariant,
  deleteVariant,
  defineCategorySchema,
  getCategorySchema,
  getAllCategorySchemas,
  deleteCategorySchema,
};
