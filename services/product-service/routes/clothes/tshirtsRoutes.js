const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../middlewear/authMiddlewear");
const {
  getTshirts, addTshirt, updateTshirt, deleteTshirt, addVariant, updateVariant, deleteVariant,
} = require("../../controllers/clothes/tshirtsController");

router.get("/getTshirts", authMiddleware, getTshirts);
router.post("/addTshirt", authMiddleware, addTshirt);
router.put("/update-Tshirt/:id", authMiddleware, updateTshirt);
router.delete("/delete-Tshirt/:id", authMiddleware, deleteTshirt);
router.post("/:id/add-tshirt-variant", authMiddleware, addVariant);
router.put("/:id/update-tshirt-variant/:variantid", authMiddleware, updateVariant);
router.delete("/:id/delete-tshirt-variant/:variantid", authMiddleware, deleteVariant);

module.exports = router;
