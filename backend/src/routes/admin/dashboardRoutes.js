const express = require("express");
const protect = require("../../middleware/auth.middleware");
const { requireAdmin } = require("../../middleware/permission.middleware");
const { getDashboardStats } = require("../../controllers/dashboard.controller");

const router = express.Router();

router.use(protect, requireAdmin);
router.get("/", getDashboardStats);

module.exports = router;
