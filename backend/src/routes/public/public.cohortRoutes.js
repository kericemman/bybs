const express = require("express");
const Cohort = require("../../models/Cohort");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cohorts = await Cohort.find({ isPublished: true }).sort({ startDate: -1, createdAt: -1 });
    res.json(cohorts);
  } catch (error) {
    console.error("Public cohorts fetch error:", error);
    res.status(500).json({ message: "Unable to fetch cohorts." });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const cohort = await Cohort.findOne({ slug: req.params.slug, isPublished: true });
    if (!cohort) return res.status(404).json({ message: "Not found" });
    res.json(cohort);
  } catch (error) {
    console.error("Public cohort fetch error:", error);
    res.status(500).json({ message: "Unable to fetch cohort." });
  }
});

module.exports = router;
