const mongoose = require("mongoose");

const waitlistSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
    },
    cohort: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cohort",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Waitlist", waitlistSchema);
