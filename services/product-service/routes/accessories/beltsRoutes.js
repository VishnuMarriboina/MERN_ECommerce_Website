const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../middlewear/authMiddlewear");
const {
  getBelts, addBeltCollection, addVariant, updateVariant, deleteVariant, updateBelt, deleteBelt,
} = require("../../controllers/accessories/beltsController");

router.get("/getBelts", authMiddleware, getBelts);
router.post("/addBeltCollection", authMiddleware, addBeltCollection);
router.put("/update-Belt/:id", authMiddleware, updateBelt);
router.delete("/delete-Belt/:id", authMiddleware, deleteBelt);
router.post("/:id/add-belt-variant", authMiddleware, addVariant);
router.put("/:id/update-belt-variant/:variantid", authMiddleware, updateVariant);
router.delete("/:id/delete-belt-variant/:variantid", authMiddleware, deleteVariant);

module.exports = router;
