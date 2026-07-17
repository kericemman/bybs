const express = require("express");
const protect = require("../../middleware/auth.middleware");
const { requireAdmin } = require("../../middleware/permission.middleware");
const upload = require("../../utils/clodinaryUpload");
const {
  createCohort,
  getCohorts,
  updateCohort,
  deleteCohort,
  deleteCohortGalleryImage,
} = require("../../controllers/cohort.controllers");

const router = express.Router();

router.use(protect, requireAdmin);

const cohortUpload = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "gallery", maxCount: 20 },
  { name: "graduateGallery", maxCount: 20 },
]);

router.get("/", getCohorts);
router.post("/", cohortUpload, createCohort);
router.put("/:id", cohortUpload, updateCohort);
router.delete("/:id/gallery/:imageId", deleteCohortGalleryImage);
router.delete("/:id", deleteCohort);

module.exports = router;
