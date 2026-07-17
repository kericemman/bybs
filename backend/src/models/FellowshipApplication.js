const mongoose = require("mongoose");

const currentStageOptions = [
  "A student preparing for a career",
  "A young professional building experience",
  "A parent raising young children",
  "Someone balancing work, family, and financial responsibilities",
  "Someone going through pregnancy or family transition",
  "Someone focusing on career growth, healing, stability, or personal development",
  "Someone nearing retirement or reflecting on legacy",
];

const heardFromOptions = [
  "Instagram",
  "LinkedIn",
  "Facebook",
  "WhatsApp",
  "A friend or family member",
  "BYBS community or team member",
  "An event, workshop, or webinar",
  "Website or Google search",
  "Other",
];

const fellowshipApplicationSchema = new mongoose.Schema(
  {
    cohort: {
      type: String,
      default: "BYBS Fellowship Cohort 4",
      trim: true,
    },
    cohortSlug: {
      type: String,
      default: "bybs-fellowship-cohort-4",
      trim: true,
      lowercase: true,
    },
    source: {
      type: String,
      default: "website",
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    linkedinUrl: {
      type: String,
      trim: true,
    },
    ageRange: {
      type: String,
      enum: ["16-20", "21-25", "26-30", "31-40", "41+"],
    },
    occupation: {
      type: String,
      trim: true,
    },
    currentStage: {
      type: String,
      enum: ["", ...currentStageOptions],
      trim: true,
    },
    motivation: {
      type: String,
      required: true,
      trim: true,
    },
    growthGoals: {
      type: String,
      required: true,
      trim: true,
    },
    challenge: {
      type: String,
      required: true,
      trim: true,
    },
    contribution: {
      type: String,
      trim: true,
    },
    cohortSchedule: {
      type: String,
      trim: true,
    },
    availability: {
      type: String,
      enum: ["yes", "mostly", "not-sure"],
      required: true,
    },
    focusAreas: [String],
    heardFrom: {
      type: String,
      enum: ["", ...heardFromOptions],
      trim: true,
    },
    consent: {
      type: Boolean,
      required: true,
    },
    status: {
      type: String,
      enum: ["new", "reviewing", "shortlisted", "accepted", "invited", "declined"],
      default: "new",
    },
    screeningGroup: {
      type: String,
      enum: ["unscreened", "accepted", "not_qualified"],
      default: "unscreened",
    },
    screeningScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    screeningReasons: [String],
    screeningMode: {
      type: String,
      enum: ["manual", "auto"],
      default: "manual",
    },
    screenedAt: Date,
    screenedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    adminNotes: {
      type: String,
      trim: true,
    },
    inviteSentAt: Date,
    inviteSentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    inviteSubject: String,
    inviteMessage: String,
  },
  { timestamps: true }
);

fellowshipApplicationSchema.index({ email: 1, cohortSlug: 1 }, { unique: true });
fellowshipApplicationSchema.index({ status: 1, createdAt: -1 });
fellowshipApplicationSchema.index({ screeningGroup: 1, createdAt: -1 });
fellowshipApplicationSchema.index({ cohortSlug: 1, createdAt: -1 });

module.exports = mongoose.model("FellowshipApplication", fellowshipApplicationSchema);
