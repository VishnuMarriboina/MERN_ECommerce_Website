const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../middlewear/authMiddlewear");
const {
  getSandals, addSandalsCollection, addVariant, updateVariant, deleteVariant, updateSandals, deleteSandals,
} = require("../../controllers/footwear/sandalsController");

router.get("/getSandals", authMiddleware, getSandals);
router.post("/addSandalsCollection", authMiddleware, addSandalsCollection);
router.put("/update-Sandals/:id", authMiddleware, updateSandals);
router.delete("/delete-Sandals/:id", authMiddleware, deleteSandals);
router.post("/:id/add-sandal-variant", authMiddleware, addVariant);
router.put("/:id/update-sandal-variant/:variantid", authMiddleware, updateVariant);
router.delete("/:id/delete-sandal-variant/:variantid", authMiddleware, deleteVariant);

module.exports = router;
