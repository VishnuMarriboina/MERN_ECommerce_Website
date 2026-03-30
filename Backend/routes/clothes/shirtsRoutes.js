const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../middlewear/authMiddlewear");
const {
  getShirts,
  addShirts,
  updateShirts,
  filterShirts,
  deleteShirts,
  buyShirts,
  updateVariant,
  deleteVariant,
  addVariant,
} = require("../../controllers/clothes/shirtsController");

router.get(
  "/getShirts",
  authMiddleware,
  getShirts
);
router.post("/filterShirts", authMiddleware, filterShirts);
router.post(
  "/addNewShirts",
  authMiddleware,
  //  authorizeRoles("admin"),
  addShirts
);
router.put("/update-Shirt/:id", authMiddleware, updateShirts);
router.delete(
  "/delete-Shirt/:id",
  authMiddleware,
  //  authorizeRoles("admin"),
  deleteShirts
);
router.put("/buy-Shirt/:id", authMiddleware, buyShirts);
router.post(
  "/:id/add-variant",
  authMiddleware,
  //  authorizeRoles("admin"),
  addVariant
);
router.put(
  "/:id/update-variant/:variantid",
  authMiddleware,
  //  authorizeRoles("admin"),
  updateVariant
);
router.delete(
  "/:id/delete-variant/:variantid",
  authMiddleware,
  //  authorizeRoles("admin"),
  deleteVariant
);

module.exports = router;
