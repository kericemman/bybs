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

    price: { type: Number, required: true },

    stock: Number, // only for merch

    coverImage: {
      url: String,
      public_id: String,
    },

    fileUrl: String, // ebook download URL (Cloudinary private URL)

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model("Product", productSchema);
