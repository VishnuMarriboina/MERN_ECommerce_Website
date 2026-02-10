const express = require("express");
const {
  getAllUsers,
  signUpUser,
  loginUser,
  refreshAccessToken,
  updateUserProfile,
  forgotPassword,
} = require("../../controllers/usersData/usersController");
const {
  authMiddleware,
  authorizeRoles,
} = require("../../middlewear/authMiddlewear");
const router = express.Router();

router.get(
  "/allUsers",
  authMiddleware,
  //  authorizeRoles("admin"),
  getAllUsers
);
router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);
router.put("/update-profile", authMiddleware, updateUserProfile);
router.post("/forgot-password", forgotPassword);

module.exports = router;
