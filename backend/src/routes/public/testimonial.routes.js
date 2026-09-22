const express = require("express");
const rateLimit = require("express-rate-limit");
const upload = require("../../utils/clodinaryUpload");
const {
  createTestimonial,
  getPublicTestimonials,
} = require("../../controllers/testimonial.controllers");

const router = express.Router();
const testimonialLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many testimonial submissions. Please try again later." },
});

router.get("/", getPublicTestimonials);
router.post("/", testimonialLimiter, upload.single("profilePhoto"), createTestimonial);

module.exports = router;
