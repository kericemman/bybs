const Article = require("../models/Article");
const Order = require("../models/Order");
const Coaching = require("../models/Coaching");

const toAdminStatus = (status) => {
  if (status === "paid" || status === "completed") return "success";
  if (status === "failed") return "failed";
  return "pending";
};

const normalizeRecentPayment = (payment, source) => ({
  _id: `${source}-${payment._id}`,
  email: payment.email,
  amount: payment.amount,
  status: toAdminStatus(payment.status),
  source,
  createdAt: payment.createdAt,
});

exports.getDashboardStats = async (req, res) => {
  const totalArticles = await Article.countDocuments();
  const publishedArticles = await Article.countDocuments({ status: "published" });
  const draftArticles = await Article.countDocuments({ status: "draft" });

  const [orders, coachingBookings] = await Promise.all([
    Order.find(),
    Coaching.find(),
  ]);

  const paidOrders = orders.filter((order) => order.status === "paid");
  const paidCoachingBookings = coachingBookings.filter(
    (booking) => booking.status === "completed"
  );

  const totalPayments = orders.length + coachingBookings.length;
  const totalRevenue = [...paidOrders, ...paidCoachingBookings].reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0
  );

  const recentArticles = await Article.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("title status createdAt");

  const recentPayments = [
    ...orders.map((payment) => normalizeRecentPayment(payment, "shop")),
    ...coachingBookings.map((payment) =>
      normalizeRecentPayment(payment, "coaching")
    ),
  ]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  res.status(200).json({
    admin: {
      name: req.admin.name,
      email: req.admin.email,
    },
    stats: {
      totalArticles,
      publishedArticles,
      draftArticles,
      totalPayments,
      totalRevenue,
    },
    recentArticles,
    recentPayments,
  });
};
