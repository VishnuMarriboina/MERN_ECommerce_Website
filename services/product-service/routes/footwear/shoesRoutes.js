const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../middlewear/authMiddlewear");
const {
  getShoes, addShoesCollection, addVariant, updateVariant, deleteVariant, updateShoes, deleteShoes,
} = require("../../controllers/footwear/shoesController");

router.get("/getShoes", authMiddleware, getShoes);
router.post("/addShoesCollection", authMiddleware, addShoesCollection);
router.put("/update-Shoes/:id", authMiddleware, updateShoes);
router.delete("/delete-Shoes/:id", authMiddleware, deleteShoes);
router.post("/:id/add-shoe-variant", authMiddleware, addVariant);
router.put("/:id/update-shoe-variant/:variantid", authMiddleware, updateVariant);
router.delete("/:id/delete-shoe-variant/:variantid", authMiddleware, deleteVariant);

module.exports = router;
