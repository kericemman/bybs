const express = require("express");
const protect = require("../../middleware/auth.middleware");
const { requireAdmin, requirePermission } = require("../../middleware/permission.middleware");
const upload = require("../../utils/clodinaryUpload");
const {
  getFellowshipApplications,
  updateFellowshipApplication,
  deleteFellowshipApplication,
  sendFellowshipInvite,
  sendBulkFellowshipInvites,
  sendFellowshipRegret,
  sendBulkFellowshipRegrets,
  screenFellowshipApplications,
  uploadFellowshipInviteImage,
} = require("../../controllers/fellowshipApplication.controllers");

const router = express.Router();

router.use(protect, requirePermission("applications:screen"));

router.get("/", getFellowshipApplications);
router.post("/screen", screenFellowshipApplications);
router.post("/invite-bulk", sendBulkFellowshipInvites);
router.post("/regret-bulk", sendBulkFellowshipRegrets);
router.post("/invite-image", upload.single("inviteImage"), uploadFellowshipInviteImage);
router.patch("/:id", updateFellowshipApplication);
router.post("/:id/invite", sendFellowshipInvite);
router.post("/:id/regret", sendFellowshipRegret);
router.delete("/:id", requireAdmin, deleteFellowshipApplication);

module.exports = router;
