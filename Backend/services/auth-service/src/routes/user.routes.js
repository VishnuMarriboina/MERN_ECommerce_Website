const express = require("express");
const router = express.Router();
const adminUserController = require("../controllers/admin-user.controller");
const { authenticate } = require("../middlewares/auth.middleware");

router.get("/allUsers", authenticate, adminUserController.getAllUsers);

module.exports = router;
