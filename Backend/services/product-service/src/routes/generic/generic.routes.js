const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { validate } = require("../../middlewares/validation.middleware");
const { genericProductValidator } = require("../../validators/generic.validator");
const {
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
} = require("../../controllers/generic/generic.controller");

// ── Products ──────────────────────────────────────────────────────
router.post("/regProduct",              authMiddleware, validate(genericProductValidator), regProduct);
router.get("/getProducts",              authMiddleware, getProductsByCategory);
router.put("/update/:id",               authMiddleware, updateGenericProduct);
router.delete("/delete/:id",            authMiddleware, deleteGenericProduct);
router.post("/:id/add-variant",                    authMiddleware, addVariant);
router.put("/:id/update-variant/:variantId",       authMiddleware, updateVariant);
router.delete("/:id/delete-variant/:variantId",    authMiddleware, deleteVariant);

// ── Category Schemas ──────────────────────────────────────────────
router.post("/defineCategory",                authMiddleware, defineCategorySchema);
router.get("/categorySchemas",                authMiddleware, getAllCategorySchemas);
router.get("/categorySchema/:name",           authMiddleware, getCategorySchema);
router.delete("/categorySchema/:name",        authMiddleware, deleteCategorySchema);

module.exports = router;
