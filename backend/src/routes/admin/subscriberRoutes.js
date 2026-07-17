const express = require("express");
const protect = require("../../middleware/auth.middleware");
const { requireAdmin } = require("../../middleware/permission.middleware");

const {
  subscribe,
  getSubscribers,
  sendCampaign,
} = require("../../controllers/subcriber.controllers");

const router = express.Router();

// Public
router.post("/", subscribe);

// Admin
router.get("/admin", protect, requireAdmin, getSubscribers);
router.post("/admin/send", protect, requireAdmin, sendCampaign);

module.exports = router;
