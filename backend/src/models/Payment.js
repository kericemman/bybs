const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
    },
    email: String,
    amount: Number, // stored in KES (already converted)
    status: {
      type: String,
      enum: ["success", "failed", "pending"],
    },
    channel: String,
    paidAt: Date,
    raw: Object, // full Paystack payload (for audits)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
