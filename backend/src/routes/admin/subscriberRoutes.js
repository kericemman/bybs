const express = require("express");
const protect = require("../../middleware/auth.middleware");

const {
  subscribe,
  getSubscribers,
  sendCampaign,
} = require("../../controllers/subcriber.controllers");

const router = express.Router();

// Public
router.post("/", subscribe);

// Admin
router.get("/admin", protect, getSubscribers);
router.post("/admin/send", protect, sendCampaign);

module.exports = router;
