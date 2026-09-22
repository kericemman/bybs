const express = require("express");
const protect = require("../../middleware/auth.middleware");
const { requireAdmin } = require("../../middleware/permission.middleware");
const {
  deleteTestimonial,
  getAdminTestimonials,
  updateTestimonial,
} = require("../../controllers/testimonial.controllers");

const router = express.Router();

router.use(protect, requireAdmin);
router.get("/", getAdminTestimonials);
router.patch("/:id", updateTestimonial);
router.delete("/:id", deleteTestimonial);

module.exports = router;
