const express = require("express");
const protect = require("../../middleware/auth.middleware");
const {
  getFellowshipApplications,
  updateFellowshipApplication,
  deleteFellowshipApplication,
  sendFellowshipInvite,
} = require("../../controllers/fellowshipApplication.controllers");

const router = express.Router();

router.use(protect);

router.get("/", getFellowshipApplications);
router.patch("/:id", updateFellowshipApplication);
router.post("/:id/invite", sendFellowshipInvite);
router.delete("/:id", deleteFellowshipApplication);

module.exports = router;
