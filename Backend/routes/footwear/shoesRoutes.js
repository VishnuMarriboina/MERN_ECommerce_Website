const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  authorizeRoles,
} = require("../../middlewear/authMiddlewear");
const {
  getShoes,
  addShoesCollection,
  updateShoes,
  addVariant,
  updateVariant,
  deleteVariant,
  deleteShoes,
} = require("../../controllers/footwear/shoesController");

router.get("/getShoes", authMiddleware, getShoes);

router.post(
  "/addNewShoes",
  authMiddleware,
  //  authorizeRoles("admin"),
  addShoesCollection
);
router.put(
  "/update-Shoes/:id",
  authMiddleware,
  //  authorizeRoles("admin"),
  updateShoes
);
router.delete(
  "/delete-Shoes/:id",
  authMiddleware,
  //  authorizeRoles("admin"),
  deleteShoes
);
router.post(
  "/shoes/:id/addVariant",
  authMiddleware,
  //  authorizeRoles("admin"),
  addVariant
);
router.put(
  "/shoes/:id/updateVariant/:variantid",
  authMiddleware,
  //  authorizeRoles("admin"),
  updateVariant
);
router.delete(
  "/shoes/:id/deleteVariant/:variantid",
  authMiddleware,
  //  authorizeRoles("admin"),
  deleteVariant
);

module.exports = router;
