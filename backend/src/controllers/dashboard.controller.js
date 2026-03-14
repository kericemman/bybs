const Article = require("../models/Article");
const Payment = require("../models/Order");

exports.getDashboardStats = async (req, res) => {
  const totalArticles = await Article.countDocuments();
  const publishedArticles = await Article.countDocuments({ status: "published" });
  const draftArticles = await Article.countDocuments({ status: "draft" });

  const totalPayments = await Payment.countDocuments();
  const payments = await Payment.find({ status: "success" });

  const totalRevenue = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  const recentArticles = await Article.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("title status createdAt");

  const recentPayments = await Payment.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("email amount status createdAt");

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
