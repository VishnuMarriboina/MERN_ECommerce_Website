const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../middlewear/authMiddlewear");
const {
  getWatches,
  addWatchesCollection,
  addVariant,
  updateVariant,
  deleteVariant,
  updateWatch,
  deleteWatch,
} = require("../../controllers/accessories/watchesControllers");

router.get("/getWatches", authMiddleware, getWatches);

router.post(
  "/addNewWatches",
  authMiddleware,
  //  authorizeRoles("admin"),
  addWatchesCollection
);
router.put(
  "/watch/update-Watch/:id",
  authMiddleware,
  //  authorizeRoles("admin"),
  updateWatch
);
router.delete(
  "/watch/delete-Watch/:id",
  authMiddleware,
  //  authorizeRoles("admin"),
  deleteWatch
);
router.post(
  "/watch/:id/addVariant",
  authMiddleware,
  //  authorizeRoles("admin"),
  addVariant
);
router.put(
  "/watch/:id/updateVariant/:variantid",
  authMiddleware,
  //  authorizeRoles("admin"),
  updateVariant
);
router.delete(
  "/watch/:id/deleteVariant/:variantid",
  authMiddleware,
  //  authorizeRoles("admin"),
  deleteVariant
);

module.exports = router;
