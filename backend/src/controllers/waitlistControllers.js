const Waitlist = require("../models/Waitlist");

exports.getWaitlistEntries = async (req, res) => {
  const filter = {};

  if (req.params.cohortId) {
    filter.cohort = req.params.cohortId;
  }

  const entries = await Waitlist.find(filter).populate("cohort", "title").sort({ createdAt: -1 });

  res.status(200).json(entries);
};

exports.deleteWaitlistEntry = async (req, res) => {
  const entry = await Waitlist.findById(req.params.id);

  if (!entry) {
    return res.status(404).json({ message: "Entry not found" });
  }

  await entry.deleteOne();

  res.status(200).json({ message: "Entry deleted" });
};
