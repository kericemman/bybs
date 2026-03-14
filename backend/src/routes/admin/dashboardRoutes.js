const express = require("express");
const protect = require("../../middleware/auth.middleware");
const { getDashboardStats } = require("../../controllers/dashboard.controller");

const router = express.Router();

router.use(protect);
router.get("/", getDashboardStats);

module.exports = router;
