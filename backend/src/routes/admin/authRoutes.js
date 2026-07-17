const express = require("express");
const { changePassword, loginAdmin, getMe } = require("../../controllers/authControllers");
const protect = require("../../middleware/auth.middleware");

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/me", protect, getMe);
router.post("/change-password", protect, changePassword);

module.exports = router;
