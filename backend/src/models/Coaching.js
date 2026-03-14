const mongoose = require("mongoose");

const CoachingSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    phone: String,
    productName: String,
    amount: Number,
    status: { type: String, default: "pending" },
    reference: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coaching", CoachingSchema);
