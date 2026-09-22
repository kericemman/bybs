const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const { randomUUID } = require("crypto");
const { cleanText, isValidEmail, normalizeEmail } = require("../utils/inputValidation");

exports.createCartOrder = async (req, res) => {
  try {
    const { customer = {}, items = [] } = req.body || {};
    const name = cleanText(customer.name, 120);
    const email = normalizeEmail(customer.email);
    const phone = cleanText(customer.phone, 40);
    const country = cleanText(customer.country, 120);
    const shippingAddress = cleanText(customer.shippingAddress, 500);

    if (!name || !isValidEmail(email) || !phone) {
      return res.status(400).json({
        message: "Name, email, and phone or WhatsApp are required",
      });
    }

    if (!Array.isArray(items) || items.length === 0 || items.length > 20) {
      return res.status(400).json({ message: "Select between 1 and 20 items" });
    }

    if (items.some((item) => !mongoose.isValidObjectId(item?.productId))) {
      return res.status(400).json({ message: "One or more product selections are invalid" });
    }

    const products = await Product.find({
      _id: mongoose.trusted({ $in: items.map((item) => item.productId) }),
    });
    const productMap = new Map(products.map((product) => [product._id.toString(), product]));
    const orderItems = [];
    let amount = 0;

    for (const item of items) {
      const product = productMap.get(String(item.productId));
      const quantity = Number(item.quantity || 0);

      if (!product) {
        return res.status(404).json({ message: "One or more products were not found" });
      }

      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
        return res.status(400).json({ message: "Invalid item quantity" });
      }

      if (
        product.type === "merch" &&
        typeof product.stock === "number" &&
        product.stock < quantity
      ) {
        return res.status(400).json({
          message: `${product.title} has only ${product.stock} left in stock`,
        });
      }

      orderItems.push({
        product: product._id,
        title: product.title,
        type: product.type,
        quantity,
        price: product.price,
      });
      amount += Number(product.price || 0) * quantity;
    }

    const containsMerch = orderItems.some((item) => item.type === "merch");

    if (containsMerch && (!country || !shippingAddress)) {
      return res.status(400).json({
        message: "Country and delivery address are required for merchandise",
      });
    }

    const reference = `BYBS-REQ-${randomUUID()}`;

    await Order.create({
      product: orderItems[0].product,
      items: orderItems,
      name,
      email,
      phone,
      country: containsMerch ? country : undefined,
      shippingAddress: containsMerch ? shippingAddress : undefined,
      amount,
      reference,
      status: "pending",
    });

    res.status(201).json({
      reference,
      amount,
      message: "Order request saved. Continue with the BYBS team on WhatsApp.",
    });
  } catch (error) {
    console.error("Create order request error:", error);
    res.status(500).json({ message: "Error creating order request" });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("product", "title type coverImage")
      .populate("items.product", "title type coverImage")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};

exports.markDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.delivered = true;
    await order.save();
    res.json({ message: "Order marked as delivered" });
  } catch (error) {
    res.status(500).json({ message: "Error updating order" });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    await order.deleteOne();
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("product").populate("items.product");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order" });
  }
};
