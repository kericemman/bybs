const express = require("express");
const rateLimit = require("express-rate-limit");
const { createParticipationApplication } = require("../../controllers/participation.controllers");

const router = express.Router();
const participationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many submissions. Please try again later." },
});

router.post("/", participationLimiter, createParticipationApplication);

module.exports = router;
