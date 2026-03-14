const express = require("express");
const Cohort = require("../../models/Cohort");

const router = express.Router();

router.get("/", async (req, res) => {
  const cohorts = await Cohort.find().sort({ startDate: -1 });
  res.json(cohorts);
});

router.get("/:slug", async (req, res) => {
  const cohort = await Cohort.findOne({ slug: req.params.slug });
  if (!cohort) return res.status(404).json({ message: "Not found" });
  res.json(cohort);
});

module.exports = router;
