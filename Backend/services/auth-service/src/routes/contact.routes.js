const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact.controller");
const { authenticate } = require("../middlewares/auth.middleware");

router.post("/submit", contactController.submit);
router.get("/all", authenticate, contactController.getAll);
router.patch("/:id/status", authenticate, contactController.updateStatus);

module.exports = router;
