const express = require("express");
const rateLimit = require("express-rate-limit");
const upload = require("../../utils/clodinaryUpload");
const {
  createSubmission,
  getActivePrompt,
  getPublicPrompt,
  getPublicPrompts,
  getPublishedSubmissions,
} = require("../../controllers/reflection.controllers");

const router = express.Router();
const submissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many reflection submissions. Please try again later." },
});

router.get("/prompts/active", getActivePrompt);
router.get("/prompts", getPublicPrompts);
router.get("/prompts/:slug", getPublicPrompt);
router.get("/prompts/:slug/submissions", getPublishedSubmissions);
router.post(
  "/prompts/:slug/submissions",
  submissionLimiter,
  upload.single("profilePhoto"),
  createSubmission
);

module.exports = router;
