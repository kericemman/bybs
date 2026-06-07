const mongoose = require("mongoose");

const charityMerchOrderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    country: { type: String, required: true },
    phone: String,
    packageType: {
      type: String,
      enum: ["single", "basic", "normal", "premium", "bundle"],
      required: true,
    },
    message: String,
    status: {
      type: String,
      enum: ["new", "contacted", "fulfilled"],
      default: "new",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CharityMerchOrder", charityMerchOrderSchema);
