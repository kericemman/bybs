const mongoose = require("mongoose");

const MerchItemSchema = new mongoose.Schema({
  productId: String,
  name: String,
  price: Number,
  quantity: { type: Number, default: 1 },
  selectedSize: String,
  selectedColor: String,
});

const MerchOrderSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    userEmail: { type: String, required: true },
    address: { type: String },
    city: { type: String },
    country: { type: String },
    postalCode: { type: String },
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, default: "pending" },
    transactionRef: { type: String },
    items: [MerchItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("MerchOrder", MerchOrderSchema);
