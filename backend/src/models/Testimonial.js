const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 140 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 220 },
    category: {
      type: String,
      required: true,
      enum: [
        "mentee",
        "mentor",
        "partner",
        "volunteer",
        "fellowship-graduate",
        "programme-participant",
        "community-member",
        "supporter",
      ],
      index: true,
    },
    roleTitle: { type: String, trim: true, maxlength: 160 },
    testimonial: { type: String, required: true, trim: true, maxlength: 2000 },
    wordCount: { type: Number, required: true, min: 25, max: 150 },
    profilePhoto: {
      url: String,
      public_id: String,
    },
    consentToPublish: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "featured", "rejected", "archived"],
      default: "pending",
      index: true,
    },
    internalNotes: { type: String, trim: true, maxlength: 4000 },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    reviewedAt: Date,
    publishedAt: Date,
  },
  { timestamps: true }
);

testimonialSchema.index({ status: 1, publishedAt: -1, createdAt: -1 });
testimonialSchema.index({ email: 1, createdAt: -1 });

module.exports = mongoose.model("Testimonial", testimonialSchema);
