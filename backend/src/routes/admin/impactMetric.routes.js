const express = require("express");
const protect = require("../../middleware/auth.middleware");
const { requireAdmin } = require("../../middleware/permission.middleware");
const {
  createImpactMetric,
  deleteImpactMetric,
  getAdminImpactMetrics,
  updateImpactMetric,
} = require("../../controllers/impactMetric.controllers");

const router = express.Router();
router.use(protect, requireAdmin);
router.get("/", getAdminImpactMetrics);
router.post("/", createImpactMetric);
router.put("/:id", updateImpactMetric);
router.delete("/:id", deleteImpactMetric);

module.exports = router;
