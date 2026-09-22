const express = require("express");
const protect = require("../../middleware/auth.middleware");
const { requireAdmin } = require("../../middleware/permission.middleware");
const upload = require("../../utils/clodinaryUpload");
const {
  createCommunityAction,
  deleteCommunityAction,
  deleteCommunityActionGalleryImage,
  getAdminCommunityActions,
  updateCommunityAction,
} = require("../../controllers/communityAction.controllers");

const router = express.Router();
const actionUpload = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "gallery", maxCount: 12 },
]);

router.use(protect, requireAdmin);
router.get("/", getAdminCommunityActions);
router.post("/", actionUpload, createCommunityAction);
router.put("/:id", actionUpload, updateCommunityAction);
router.delete("/:id/gallery/:imageId", deleteCommunityActionGalleryImage);
router.delete("/:id", deleteCommunityAction);

module.exports = router;
