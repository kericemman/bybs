const express = require("express");
const protect = require("../../middleware/auth.middleware");
const { requireAdmin } = require("../../middleware/permission.middleware");
const Order = require("../../models/Order");
const Coaching = require("../../models/Coaching");

const router = express.Router();

const toAdminStatus = (status) => {
  if (status === "paid" || status === "completed") return "success";
  if (status === "failed") return "failed";
  return "pending";
};

const toSubunitAmount = (amount) => Math.round(Number(amount || 0) * 100);

const normalizeOrderPayment = (order) => ({
  _id: `order-${order._id}`,
  sourceId: order._id,
  source: "shop",
  email: order.email,
  reference: order.reference,
  amount: toSubunitAmount(order.amount),
  currency: "USD",
  fees: 0,
  status: toAdminStatus(order.status),
  channel: "paystack",
  paidAt: order.status === "paid" ? order.updatedAt : order.createdAt,
  createdAt: order.createdAt,
  transactionId: order.reference,
  description:
    order.items?.length > 0
      ? `${order.items.length} merch item${order.items.length === 1 ? "" : "s"}`
      : order.product?.title,
});

const normalizeCoachingPayment = (booking) => ({
  _id: `coaching-${booking._id}`,
  sourceId: booking._id,
  source: "coaching",
  email: booking.email,
  reference: booking.reference,
  amount: toSubunitAmount(booking.amount),
  currency: "USD",
  fees: 0,
  status: toAdminStatus(booking.status),
  channel: "paystack",
  paidAt: booking.status === "completed" ? booking.updatedAt : booking.createdAt,
  createdAt: booking.createdAt,
  transactionId: booking.reference,
  description: booking.productName,
});

const loadPayments = async () => {
  const [orders, coachingBookings] = await Promise.all([
    Order.find().populate("product", "title type").sort({ createdAt: -1 }),
    Coaching.find().sort({ createdAt: -1 }),
  ]);

  return [
    ...orders.map(normalizeOrderPayment),
    ...coachingBookings.map(normalizeCoachingPayment),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

router.use(protect, requireAdmin);

router.get("/", async (_req, res) => {
  try {
    const payments = await loadPayments();
    res.json(payments);
  } catch (error) {
    console.error("Admin payments fetch error:", error);
    res.status(500).json({ message: "Failed to load payments" });
  }
});

router.get("/stats", async (_req, res) => {
  try {
    const payments = await loadPayments();
    const successfulPayments = payments.filter(
      (payment) => payment.status === "success"
    );
    const uniqueCustomers = new Set(
      payments.map((payment) => payment.email).filter(Boolean)
    );
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const newCustomers = new Set(
      payments
        .filter((payment) => new Date(payment.createdAt) >= monthStart)
        .map((payment) => payment.email)
        .filter(Boolean)
    );

    res.json({
      totalPayments: payments.length,
      successfulPayments: successfulPayments.length,
      successRate: payments.length
        ? Math.round((successfulPayments.length / payments.length) * 100)
        : 0,
      uniqueCustomers: uniqueCustomers.size,
      newCustomers: newCustomers.size,
      totalRevenue: successfulPayments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      ),
    });
  } catch (error) {
    console.error("Admin payment stats error:", error);
    res.status(500).json({ message: "Failed to load payment stats" });
  }
});

router.post("/sync", async (_req, res) => {
  res.json({
    success: true,
    message: "Payments are synced from shop orders and coaching bookings.",
  });
});

module.exports = router;
