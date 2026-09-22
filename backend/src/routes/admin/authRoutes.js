const express = require("express");
const {
  changePassword,
  getMe,
  loginAdmin,
  logoutAdmin,
} = require("../../controllers/authControllers");
const protect = require("../../middleware/auth.middleware");
const { authLimiter } = require("../../middleware/rateLimit.middleware");

const router = express.Router();

router.post("/login", authLimiter, loginAdmin);
router.post("/logout", logoutAdmin);
router.get("/me", protect, getMe);
router.post("/change-password", protect, changePassword);

module.exports = router;
