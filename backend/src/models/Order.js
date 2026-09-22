const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        title: String,
        type: {
          type: String,
          enum: ["ebook", "merch"],
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
          max: 20,
        },
        price: Number,
      },
    ],

    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true, maxlength: 40 },

    country: { type: String, trim: true, maxlength: 120 },
    shippingAddress: { type: String, trim: true, maxlength: 500 },

    amount: Number,
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    reference: { type: String, required: true, unique: true },

    delivered: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
