const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profile.controller");
const { authenticate } = require("../middlewares/auth.middleware");

router.put("/update-profile", authenticate, profileController.updateProfile);

module.exports = router;
