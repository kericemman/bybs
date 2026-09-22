const mongoose = require("mongoose");
const slugify = require("slugify");

const communityActionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
      maxlength: 600,
    },
    contentType: {
      type: String,
      enum: ["outreach", "fellowship", "transformation", "volunteer", "partnership", "programme"],
      default: "outreach",
      index: true,
    },
    story: {
      type: String,
      trim: true,
      maxlength: 30000,
    },
    whatHappened: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
    whyItMattered: {
      type: String,
      trim: true,
      maxlength: 3000,
    },
    actionDate: Date,
    location: {
      type: String,
      trim: true,
      maxlength: 180,
    },
    participantCount: {
      type: Number,
      min: 0,
    },
    participantsDescription: { type: String, trim: true, maxlength: 2000 },
    beneficiaryCount: { type: Number, min: 0 },
    beneficiaries: { type: String, trim: true, maxlength: 2000 },
    partners: [{ type: String, trim: true, maxlength: 180 }],
    resourcesContributed: [{ type: String, trim: true, maxlength: 240 }],
    outcomes: [{ type: String, trim: true, maxlength: 500 }],
    relatedProgramme: { type: String, trim: true, maxlength: 160 },
    quote: {
      text: { type: String, trim: true, maxlength: 1000 },
      attribution: { type: String, trim: true, maxlength: 180 },
    },
    ctaLabel: {
      type: String,
      trim: true,
      maxlength: 60,
      default: "Learn more",
    },
    ctaUrl: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    seoTitle: { type: String, trim: true, maxlength: 70 },
    metaDescription: { type: String, trim: true, maxlength: 180 },
    publishedAt: Date,
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

communityActionSchema.pre("save", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  if (this.status !== "published") this.isFeatured = false;
  if (this.status === "published" && !this.publishedAt) this.publishedAt = new Date();
  next();
});

module.exports = mongoose.model("CommunityAction", communityActionSchema);
