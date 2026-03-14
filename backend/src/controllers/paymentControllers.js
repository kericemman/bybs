const crypto = require("crypto");
const Order = require("../models/Order");
const Product = require("../models/Product");

const { generateInvoice } = require("../utils/generateInvoice");
const { sendEbookEmail, sendMerchEmail } = require("../utils/email");


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
// 5️⃣ VERIFY PAYMENT (SUCCESS PAGE)
// ===============================
exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const order = await Order.findOne({ reference }).populate("product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment not confirmed yet"
      });
    }

    res.json({
      success: true,
      order
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

      const order = await Order.findOne({ reference }).populate("product");

      if (!order) {
        console.log("Order not found");
        return res.sendStatus(200);
      }

      if (order.status === "paid") {
        console.log("Already processed");
        return res.sendStatus(200);
      }

      order.status = "paid";
      await order.save();

      console.log("Order marked paid");

      if (order.product.type === "merch") {
        order.product.stock -= 1;
        await order.product.save();
      }

      const invoicePath = await generateInvoice(order);

      if (order.product.type === "ebook") {
        await sendEbookEmail(order, invoicePath);
      } else {
        await sendMerchEmail(order, invoicePath);
      }

      console.log("Email sent");
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
      .populate("product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);

  } catch (error) {
    res.status(500).json({ message: "Error fetching order" });
  }
};
