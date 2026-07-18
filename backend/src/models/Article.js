const mongoose = require("mongoose");
const slugify = require("slugify");

const createExcerpt = (html = "", maxLength = 160) => {
  const plainText = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (plainText.length <= maxLength) return plainText;
  return `${plainText.slice(0, maxLength).trim()}...`;
};

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

   
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    excerpt: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    content: {
      type: String,
      required: true,
    },
    coverImage: {
      url: String,
      public_id: String,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    newsletter: {
      sentAt: Date,
      lastAttemptAt: Date,
      recipientCount: {
        type: Number,
        default: 0,
      },
      failedCount: {
        type: Number,
        default: 0,
      },
      emailIds: {
        type: [String],
        default: [],
      },
      error: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);

articleSchema.pre("save", function (next) {
  if (this.isModified("slug") && this.slug) {
    this.slug = slugify(this.slug, { lower: true, strict: true });
  }

  if (!this.slug || this.isModified("title")) {
    this.slug = slugify(this.slug || this.title, { lower: true, strict: true });
  }

  if (this.excerpt && !this.description) {
    this.description = this.excerpt;
  }

  if (this.description && !this.excerpt) {
    this.excerpt = this.description;
  }

  if (!this.excerpt && !this.description && this.content) {
    const generatedExcerpt = createExcerpt(this.content);
    this.excerpt = generatedExcerpt;
    this.description = generatedExcerpt;
  }

  next();
});

module.exports = mongoose.model("Article", articleSchema);
