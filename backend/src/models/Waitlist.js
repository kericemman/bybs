const mongoose = require("mongoose");

const waitlistSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    cohort: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cohort",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Waitlist", waitlistSchema);
