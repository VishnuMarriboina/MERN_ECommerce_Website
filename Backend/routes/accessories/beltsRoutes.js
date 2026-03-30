const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../middlewear/authMiddlewear");
const {
  getBelts,
  addBeltCollection,
  addVariant,
  updateVariant,
  deleteVariant,
  updateBelt,
  deleteBelt,
} = require("../../controllers/accessories/beltsControllers");

router.get("/getBelts", authMiddleware, getBelts);

router.post(
  "/addNewBelts",
  authMiddleware,
  //  authorizeRoles("admin"),
  addBeltCollection
);
router.put(
  "/update-Belt/:id",
  authMiddleware,
  //  authorizeRoles("admin"),
  updateBelt
);

router.post(
  "/:id/addVariant",
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

router.delete(
  "/delete-Belt/:id",
  authMiddleware,
  //  authorizeRoles("admin"),
  deleteBelt
);

module.exports = router;
