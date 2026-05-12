const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../middlewear/authMiddlewear");
const {
  getShirts, addShirts, updateShirts, filterShirts, deleteShirts, buyShirts, updateVariant, deleteVariant, addVariant,
} = require("../../controllers/clothes/shirtsController");

router.get("/getShirts", authMiddleware, getShirts);
router.post("/filterShirts", authMiddleware, filterShirts);
router.post("/addNewShirts", authMiddleware, addShirts);
router.put("/update-Shirt/:id", authMiddleware, updateShirts);
router.delete("/delete-Shirt/:id", authMiddleware, deleteShirts);
router.put("/buy-Shirt/:id", authMiddleware, buyShirts);
router.post("/:id/add-variant", authMiddleware, addVariant);
router.put("/:id/update-variant/:variantid", authMiddleware, updateVariant);
router.delete("/:id/delete-variant/:variantid", authMiddleware, deleteVariant);

module.exports = router;
