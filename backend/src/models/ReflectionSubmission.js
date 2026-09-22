const mongoose = require("mongoose");

const reflectionSubmissionSchema = new mongoose.Schema(
  {
    prompt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WeeklyReflectionPrompt",
      required: true,
      index: true,
    },
    promptSlug: { type: String, required: true, trim: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 140 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 220 },
    country: { type: String, required: true, trim: true, maxlength: 120 },
    city: { type: String, trim: true, maxlength: 120 },
    relationship: {
      type: String,
      required: true,
      enum: [
        "Current Fellow",
        "Alumni",
        "Volunteer",
        "Mentor",
        "Supporter",
        "Partner",
        "Community Member",
        "Visitor / Friend of BYBS",
      ],
    },
    response: { type: String, required: true, trim: true, minlength: 40, maxlength: 8000 },
    profilePhoto: {
      url: String,
      public_id: String,
    },
    socialProfile: { type: String, trim: true, maxlength: 500 },
    anonymousRequested: { type: Boolean, default: false },
    publishAnonymously: { type: Boolean, default: false },
    consentToPublish: { type: Boolean, required: true },
    consentToUseImage: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "approved", "featured", "rejected", "archived"],
      default: "pending",
      index: true,
    },
    displayExcerpt: { type: String, trim: true, maxlength: 1200 },
    scheduledFor: Date,
    internalNotes: { type: String, trim: true, maxlength: 4000 },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    reviewedAt: Date,
    publishedAt: Date,
  },
  { timestamps: true }
);

reflectionSubmissionSchema.index({ prompt: 1, status: 1, scheduledFor: 1 });

module.exports = mongoose.model("ReflectionSubmission", reflectionSubmissionSchema);
