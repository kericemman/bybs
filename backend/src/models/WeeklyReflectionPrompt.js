const mongoose = require("mongoose");
const slugify = require("slugify");

const weeklyReflectionPromptSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, trim: true },
    question: { type: String, required: true, trim: true, maxlength: 600 },
    description: { type: String, trim: true, maxlength: 3000 },
    weekLabel: { type: String, required: true, trim: true, maxlength: 100 },
    reflectionDate: { type: Date, required: true },
    opensAt: { type: Date, required: true },
    closesAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ["draft", "active", "closed", "archived"],
      default: "draft",
    },
    featuredImage: {
      url: String,
      public_id: String,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

weeklyReflectionPromptSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    const datePart = this.reflectionDate
      ? new Date(this.reflectionDate).toISOString().slice(0, 10)
      : Date.now();
    this.slug = slugify(`${this.title}-${datePart}`, { lower: true, strict: true });
  }
  next();
});

weeklyReflectionPromptSchema.index({ status: 1, reflectionDate: -1 });

module.exports = mongoose.model("WeeklyReflectionPrompt", weeklyReflectionPromptSchema);
