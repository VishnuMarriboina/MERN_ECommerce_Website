const genericService = require("../../services/generic/generic.service");
const MSGS = require("../../constants/product.messages");

const isAdmin = (user) => user?.User_Role?.toLowerCase() === "admin";

const regProduct = async (req, res) => {
  try {
    if (!isAdmin(req.user)) return res.status(403).json({ message: MSGS.ADMIN_ONLY });
    const product = await genericService.regProduct(req.user.userId, req.body);
    res.status(201).json({ message: MSGS.ADDED_SUCCESS, data: product });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    if (!category) return res.status(400).json({ message: "category query parameter is required" });
    const products = await genericService.getProductsByCategory(category);
    res.status(200).json({ message: MSGS.FETCH_SUCCESS, data: products });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const updateGenericProduct = async (req, res) => {
  try {
    if (!isAdmin(req.user)) return res.status(403).json({ message: MSGS.ADMIN_ONLY });
    const updated = await genericService.updateGenericProduct(req.params.id, req.body);
    res.status(200).json({ message: MSGS.UPDATED_SUCCESS, data: updated });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const deleteGenericProduct = async (req, res) => {
  try {
    if (!isAdmin(req.user)) return res.status(403).json({ message: MSGS.ADMIN_ONLY });
    await genericService.deleteGenericProduct(req.params.id);
    res.status(200).json({ message: MSGS.DELETED_SUCCESS });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const addVariant = async (req, res) => {
  try {
    if (!isAdmin(req.user)) return res.status(403).json({ message: MSGS.ADMIN_ONLY });
    const product = await genericService.addVariant(req.params.id, req.body);
    res.status(201).json({ message: MSGS.VARIANT_ADDED, data: product });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const updateVariant = async (req, res) => {
  try {
    if (!isAdmin(req.user)) return res.status(403).json({ message: MSGS.ADMIN_ONLY });
    const product = await genericService.updateVariant(req.params.id, req.params.variantId, req.body);
    res.status(200).json({ message: MSGS.VARIANT_UPDATED, data: product });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const deleteVariant = async (req, res) => {
  try {
    if (!isAdmin(req.user)) return res.status(403).json({ message: MSGS.ADMIN_ONLY });
    await genericService.deleteVariant(req.params.id, req.params.variantId);
    res.status(200).json({ message: MSGS.VARIANT_DELETED });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

/* ── Category Schema controllers ─────────────────────────────────── */

const defineCategorySchema = async (req, res) => {
  try {
    if (!isAdmin(req.user)) return res.status(403).json({ message: MSGS.ADMIN_ONLY });
    const schema = await genericService.defineCategorySchema(req.user.userId, req.body);
    res.status(200).json({ message: "Category schema saved", data: schema });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const getCategorySchema = async (req, res) => {
  try {
    const schema = await genericService.getCategorySchema(req.params.name);
    if (!schema) return res.status(404).json({ message: "No schema defined for this category" });
    res.status(200).json({ message: MSGS.FETCH_SUCCESS, data: schema });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const getAllCategorySchemas = async (req, res) => {
  try {
    const schemas = await genericService.getAllCategorySchemas();
    res.status(200).json({ message: MSGS.FETCH_SUCCESS, data: schemas });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const deleteCategorySchema = async (req, res) => {
  try {
    if (!isAdmin(req.user)) return res.status(403).json({ message: MSGS.ADMIN_ONLY });
    await genericService.deleteCategorySchema(req.params.name);
    res.status(200).json({ message: "Category schema deleted" });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
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
