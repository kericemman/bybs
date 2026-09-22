const mongoose = require("mongoose");
const slugify = require("slugify");

const cohortSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    description: String,
    tagline: String,
    overview: String,
    isPublished: {
      type: Boolean,
      default: false,
    },

    startDate: Date,
    endDate: Date,
    applicationDeadline: Date,

    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      required: true,
    },

    applicationStatus: {
      type: String,
      enum: ["opening-soon", "open", "closed", "invite-only"],
      default: "closed",
    },

    format: {
      type: String,
      enum: ["online", "hybrid", "in-person", "flexible"],
      default: "online",
    },

    location: String,
    schedule: String,
    capacity: Number,

    price: Number,
    currency: {
      type: String,
      default: "USD",
    },

    features: [String],
    eligibility: [String],
    curriculum: [String],
    outcomes: [String],
    whoIsItFor: [String],
    whoCanApply: [String],
    commitment: [String],
    successStories: [String],
    previousCohorts: [String],
    achievements: [String],
    impactHighlights: [String],

    facilitators: [String],
    inviteSubject: String,
    inviteMessage: String,

    coverImage: {
      url: String,
      public_id: String,
    },

    gallery: [
      {
        url: String,
        public_id: String,
        caption: String,
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

cohortSchema.pre("save", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Cohort", cohortSchema);
