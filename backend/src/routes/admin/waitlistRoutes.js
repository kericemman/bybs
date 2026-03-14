const express = require("express");
const protect = require("../../middleware/auth.middleware");
const {
  getWaitlistEntries,
  deleteWaitlistEntry,
} = require("../../controllers/waitlistControllers");

const router = express.Router();

router.use(protect);

// GET all waitlist entries
router.get("/", getWaitlistEntries);

// GET by cohort
router.get("/cohort/:cohortId", getWaitlistEntries);

// DELETE entry
router.delete("/:id", deleteWaitlistEntry);

module.exports = router;
