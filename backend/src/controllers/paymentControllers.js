const crypto = require("crypto");
const axios = require("axios");
const Order = require("../models/Order");
const Product = require("../models/Product");

const { generateInvoice } = require("../utils/generateInvoice");
const { sendEbookEmail, sendMerchEmail } = require("../utils/email");

const verifyPaystackTransaction = async (reference) => {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    const error = new Error("Paystack secret key is not configured");
    error.statusCode = 500;
    throw error;
  }

  const { data } = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  return data?.data;
};

const populateOrder = (query) =>
  query.populate("product").populate("items.product");

const sendOrderReceipt = async (order) => {
  const invoicePath = await generateInvoice(order);
  const hasMerchItems =
    order.items?.length > 0
      ? order.items.some((item) => item.type === "merch")
      : order.product.type === "merch";

  if (hasMerchItems) {
    await sendMerchEmail(order, invoicePath);
    return;
  }

  await sendEbookEmail(order, invoicePath);
};

const markOrderAsPaid = async (reference) => {
  const order = await populateOrder(
    Order.findOneAndUpdate(
      { reference, status: { $ne: "paid" } },
      { status: "paid" },
      { new: true }
    )
  );

  if (!order) {
    return populateOrder(Order.findOne({ reference }));
  }

  if (order.items && order.items.length > 0) {
    for (const item of order.items) {
      if (item.product && item.product.type === "merch") {
        if (typeof item.product.stock === "number") {
          item.product.stock = Math.max(0, item.product.stock - item.quantity);
          await item.product.save();
        }
      }
    }
  } else if (order.product.type === "merch") {
    if (typeof order.product.stock === "number") {
      order.product.stock = Math.max(0, order.product.stock - 1);
      await order.product.save();
    }
  }

  await sendOrderReceipt(order);
  return order;
};


// ===============================
// 1️⃣ CREATE ORDER (Before Paystack Payment)
// ===============================
exports.createOrder = async (req, res) => {
  try {
    const { productId, name, email, shippingAddress } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const reference = `BYBS-${Date.now()}`;

    const order = await Order.create({
      product: product._id,
      name,
      email,
      shippingAddress: product.type === "merch" ? shippingAddress : undefined,
      amount: product.price,
      reference,
      status: "pending",
    });

    res.status(201).json({
      reference,
      amount: product.price,
      email,
    });

  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Error creating order" });
  }
};

// ===============================
// CREATE CART ORDER (MERCH CHECKOUT)
// ===============================
exports.createCartOrder = async (req, res) => {
  try {
    const { customer = {}, items = [] } = req.body;
    const { name, email, phone, shippingAddress } = customer;

    if (!name || !email || !shippingAddress) {
      return res.status(400).json({
        message: "Name, email, and delivery address are required",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const productIds = items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(
      products.map((product) => [product._id.toString(), product])
    );

    const orderItems = [];
    let amount = 0;

    for (const item of items) {
      const product = productMap.get(String(item.productId));
      const quantity = Number(item.quantity || 0);

      if (!product) {
        return res.status(404).json({ message: "One or more products were not found" });
      }

      if (product.type !== "merch") {
        return res.status(400).json({
          message: "Cart checkout is only available for merchandise",
        });
      }

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ message: "Invalid item quantity" });
      }

      if (typeof product.stock === "number" && product.stock < quantity) {
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

    const reference = `BYBS-${Date.now()}`;

    await Order.create({
      product: orderItems[0].product,
      items: orderItems,
      name,
      email,
      phone,
      shippingAddress,
      amount,
      reference,
      status: "pending",
    });

    res.status(201).json({
      reference,
      amount,
      email,
    });
  } catch (error) {
    console.error("Create cart order error:", error);
    res.status(500).json({ message: "Error creating cart order" });
  }
};


// ===============================
// 5️⃣ VERIFY PAYMENT (SUCCESS PAGE)
// ===============================
exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const order = await populateOrder(Order.findOne({ reference }));

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.status === "paid") {
      return res.json({
        success: true,
        order
      });
    }

    const transaction = await verifyPaystackTransaction(reference);

    if (!transaction || transaction.status !== "success") {
      return res.status(400).json({
        success: false,
        message: "Payment not confirmed yet"
      });
    }

    if (transaction.reference !== reference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference mismatch"
      });
    }

    const expectedAmount = Math.round(Number(order.amount || 0) * 100);

    if (Number(transaction.amount) !== expectedAmount) {
      return res.status(400).json({
        success: false,
        message: "Payment amount mismatch"
      });
    }

    const paidOrder = await markOrderAsPaid(reference);

    res.json({
      success: true,
      order: paidOrder
    });

  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({
      success: false,
      message: "Verification failed"
    });
  }
};


// ===============================
// 2️⃣ PAYSTACK WEBHOOK (SECURE)
// ===============================
exports.handleWebhook = async (req, res) => {
  try {
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(req.body) // raw buffer
      .digest("hex");

    const signature = req.headers["x-paystack-signature"];

    if (hash !== signature) {
      console.log("Invalid signature");
      return res.sendStatus(401);
    }

    const event = JSON.parse(req.body.toString());

    console.log("Webhook event:", event.event);

    if (event.event === "charge.success") {
      const reference = event.data.reference;

      console.log("Looking for order:", reference);

      const order = await markOrderAsPaid(reference);

      if (!order) {
        console.log("Order not found");
        return res.sendStatus(200);
      }

      if (order.status === "paid") {
        console.log("Order marked paid");
        return res.sendStatus(200);
      }
    }

    res.sendStatus(200);

  } catch (error) {
    console.error("Webhook error:", error);
    res.sendStatus(500);
  }
};



// ===============================
// 3️⃣ ADMIN — GET ALL ORDERS
// ===============================
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("product", "title type")
      .populate("items.product", "title type")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};


// ===============================
// 4️⃣ ADMIN — MARK MERCH DELIVERED
// ===============================
exports.markDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

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

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.deleteOne();

    res.json({ message: "Order deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error deleting order" });
  }
};


exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("product")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);

  } catch (error) {
    res.status(500).json({ message: "Error fetching order" });
  }
};
