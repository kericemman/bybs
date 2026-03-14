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

    startDate: Date,
    endDate: Date,

    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      required: true,
    },

    capacity: Number,

    price: Number,

    features: [String],

    facilitators: [String],

    coverImage: {
      url: String,
      public_id: String,
    },

    gallery: [
      {
        url: String,
        public_id: String,
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
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model("Cohort", cohortSchema);
