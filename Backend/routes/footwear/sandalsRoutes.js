const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../middlewear/authMiddlewear");
const {
  getSandals,
  addSandalsCollection,
  updateSandals,
  addVariant,
  updateVariant,
  deleteVariant,
  deleteSandals,
} = require("../../controllers/footwear/sandalsController");

router.get("/getSandals", authMiddleware, getSandals);

router.post(
  "/addNewSandals",
  authMiddleware,
  //  authorizeRoles("admin"),
  addSandalsCollection
);
router.put(
  "/update-Sandals/:id",
  authMiddleware,
  //  authorizeRoles("admin"),
  updateSandals
);
router.delete(
  "/delete-Sandals/:id",
  authMiddleware,
  //  authorizeRoles("admin"),
  deleteSandals
);
router.post(
  "/sandals/:id/addVariant",
  authMiddleware,
  //  authorizeRoles("admin"),
  addVariant
);
router.put(
  "/sandals/:id/updateVariant/:variantid",
  authMiddleware,
  //  authorizeRoles("admin"),
  updateVariant
);
router.delete(
  "/sandals/:id/deleteVariant/:variantid",
  authMiddleware,
  //  authorizeRoles("admin"),
  deleteVariant
);

module.exports = router;
