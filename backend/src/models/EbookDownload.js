const mongoose = require("mongoose");

const ebookDownloadSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    productTitle: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      index: true,
    },
    emailStatus: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    emailProviderId: String,
    emailError: String,
    tokenHash: { type: String, required: true, unique: true, select: false },
    expiresAt: { type: Date, required: true, index: true },
    downloadCount: { type: Number, default: 0, min: 0 },
    lastDownloadedAt: Date,
  },
  { timestamps: true }
);

ebookDownloadSchema.index({ product: 1, email: 1, createdAt: -1 });

module.exports = mongoose.model("EbookDownload", ebookDownloadSchema);
