const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../middlewear/authMiddlewear");
const {
  getWatches, addWatchesCollection, addVariant, updateVariant, deleteVariant, updateWatch, deleteWatch,
} = require("../../controllers/accessories/watchesController");

router.get("/getWatches", authMiddleware, getWatches);
router.post("/addWatchesCollection", authMiddleware, addWatchesCollection);
router.put("/update-Watch/:id", authMiddleware, updateWatch);
router.delete("/delete-Watch/:id", authMiddleware, deleteWatch);
router.post("/:id/add-watch-variant", authMiddleware, addVariant);
router.put("/:id/update-watch-variant/:variantid", authMiddleware, updateVariant);
router.delete("/:id/delete-watch-variant/:variantid", authMiddleware, deleteVariant);

module.exports = router;
