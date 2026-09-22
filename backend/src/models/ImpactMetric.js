const mongoose = require("mongoose");

const impactMetricSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true, maxlength: 80 },
    value: { type: Number, required: true, min: 0 },
    suffix: { type: String, trim: true, maxlength: 12 },
    description: { type: String, trim: true, maxlength: 240 },
    category: {
      type: String,
      enum: ["general", "fellowship", "community", "volunteer", "mentor", "partner"],
      default: "general",
    },
    displayOrder: { type: Number, default: 0, min: 0, max: 999 },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    verificationNote: { type: String, trim: true, maxlength: 1200 },
    verifiedAt: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

impactMetricSchema.index({ status: 1, displayOrder: 1, createdAt: 1 });

module.exports = mongoose.model("ImpactMetric", impactMetricSchema);
