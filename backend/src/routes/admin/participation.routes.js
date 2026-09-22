const express = require("express");
const protect = require("../../middleware/auth.middleware");
const { requireAdmin } = require("../../middleware/permission.middleware");
const {
  getParticipationApplications,
  updateParticipationApplication,
} = require("../../controllers/participation.controllers");

const router = express.Router();

router.use(protect, requireAdmin);
router.get("/", getParticipationApplications);
router.patch("/:id", updateParticipationApplication);

module.exports = router;
