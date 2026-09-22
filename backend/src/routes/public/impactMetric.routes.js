const express = require("express");
const { getPublicImpactMetrics } = require("../../controllers/impactMetric.controllers");

const router = express.Router();
router.get("/", getPublicImpactMetrics);

module.exports = router;
