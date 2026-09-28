const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: String,

    type: {
      type: String,
      enum: ["ebook", "merch"],
      required: true,
    },

    price: { type: Number, required: true, min: 0 },

    stock: Number, // only for merch

    coverImage: {
      url: String,
      public_id: String,
    },

    images: [
      {
        url: String,
        public_id: String,
        _id: false,
      },
    ],

    fileUrl: String, // ebook download URL
    filePublicId: String,
    fileName: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
