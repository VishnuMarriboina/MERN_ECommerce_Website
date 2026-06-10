const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { validate } = require("../middlewares/validation.middleware");
const { signUpValidator, loginValidator, forgotPasswordValidator } = require("../validators/auth.validator");

router.post("/signup", validate(signUpValidator), authController.signUp);
router.post("/login", validate(loginValidator), authController.login);
router.post("/refresh-token", authController.refreshAccessToken);
router.post("/forgot-password", validate(forgotPasswordValidator), authController.forgotPassword);

module.exports = router;
