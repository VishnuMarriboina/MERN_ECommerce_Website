const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../middlewear/authMiddlewear");
const {
  getTshirts,
  addTshirt,
  updateTshirt,
  deleteTshirt,
  addVariant,
  updateVariant,
  deleteVariant,
} = require("../../controllers/clothes/tshirtsController");

router.get("/getTshirts", authMiddleware, getTshirts);
router.post(
  "/addNewTshirts",
  authMiddleware,
  //  authorizeRoles("admin"),
  addTshirt
);
router.put(
  "/update-Tshirt/:id",
  authMiddleware,
  //  authorizeRoles("admin"),
  updateTshirt
);
router.delete(
  "/deletetshirt/:id",
  authMiddleware,
  //  authorizeRoles("admin"),
  deleteTshirt
);
router.post(
  "/tshirt/:id/variant",
  authMiddleware,
  //  authorizeRoles("admin"),
  addVariant
);
router.put(
  "/tshirt/:id/variant/:variantid",
  authMiddleware,
  //  authorizeRoles("admin"),
  updateVariant
);
router.delete(
  "/tshirt/:id/variant/:variantid",
  authMiddleware,
  //  authorizeRoles("admin"),
  deleteVariant
);

module.exports = router;
