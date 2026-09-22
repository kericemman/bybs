const mongoose = require("mongoose");

const participationApplicationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["volunteer", "mentor", "partner", "support"],
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 140 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 220 },
    phone: { type: String, required: true, trim: true, maxlength: 60 },
    country: { type: String, required: true, trim: true, maxlength: 120 },
    city: { type: String, trim: true, maxlength: 120 },
    status: {
      type: String,
      enum: ["new", "reviewing", "contacted", "accepted", "active", "inactive", "declined"],
      default: "new",
      index: true,
    },
    consent: { type: Boolean, required: true },
    source: { type: String, default: "website", trim: true, maxlength: 80 },

    skills: [{ type: String, trim: true, maxlength: 120 }],
    interestAreas: [{ type: String, trim: true, maxlength: 160 }],
    availability: { type: String, trim: true, maxlength: 600 },
    experience: { type: String, trim: true, maxlength: 4000 },
    motivation: { type: String, trim: true, maxlength: 4000 },
    profileUrl: { type: String, trim: true, maxlength: 500 },
    volunteerType: {
      type: String,
      enum: ["", "one-time", "project-based", "ongoing"],
      default: "",
    },

    professionalBackground: { type: String, trim: true, maxlength: 4000 },
    expertise: [{ type: String, trim: true, maxlength: 160 }],
    yearsExperience: { type: Number, min: 0, max: 80 },
    mentorshipInterests: [{ type: String, trim: true, maxlength: 160 }],

    organizationName: { type: String, trim: true, maxlength: 220 },
    organizationType: { type: String, trim: true, maxlength: 160 },
    roleTitle: { type: String, trim: true, maxlength: 160 },
    partnershipAreas: [{ type: String, trim: true, maxlength: 180 }],
    organizationWebsite: { type: String, trim: true, maxlength: 500 },
    proposal: { type: String, trim: true, maxlength: 5000 },

    supportArea: { type: String, trim: true, maxlength: 180 },
    contributionDetails: { type: String, trim: true, maxlength: 5000 },

    internalNotes: { type: String, trim: true, maxlength: 5000 },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    reviewedAt: Date,
  },
  { timestamps: true }
);

participationApplicationSchema.index({ type: 1, status: 1, createdAt: -1 });
participationApplicationSchema.index({ email: 1, type: 1 });

module.exports = mongoose.model("ParticipationApplication", participationApplicationSchema);
