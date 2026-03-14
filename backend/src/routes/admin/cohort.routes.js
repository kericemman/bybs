const express = require("express");
const protect = require("../../middleware/auth.middleware");
const upload = require("../../utils/clodinaryUpload");
const {
  createCohort,
  getCohorts,
  updateCohort,
  deleteCohort,
} = require("../../controllers/cohort.controllers");

const router = express.Router();

router.use(protect);

router.get("/", getCohorts);
router.post("/", upload.array("gallery", 10), createCohort);
router.put("/:id", upload.array("gallery", 10), updateCohort);
router.delete("/:id", deleteCohort);

module.exports = router;
