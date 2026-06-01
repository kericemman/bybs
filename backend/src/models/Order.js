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
        },
        price: Number,
      },
    ],

    email: String,
    name: String,
    phone: String,

    shippingAddress: String, // only for merch

    amount: Number,
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    reference: String, // Paystack reference

    delivered: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
