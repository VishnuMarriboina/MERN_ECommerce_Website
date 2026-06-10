const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/auth.middleware");
const { rateProduct, getMyRating } = require("../controllers/rating.controller");

router.post("/rate", authMiddleware, rateProduct);
router.get("/my-rating", authMiddleware, getMyRating);

module.exports = router;
