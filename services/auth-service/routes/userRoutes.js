const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewear/authMiddlewear");
const {
  getAllUsers, signUpUser, loginUser, refreshAccessToken, updateUserProfile, forgotPassword,
} = require("../controllers/usersController");

router.get("/allUsers", authMiddleware, getAllUsers);
router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);
router.put("/update-profile", authMiddleware, updateUserProfile);
router.post("/forgot-password", forgotPassword);

module.exports = router;
