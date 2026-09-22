const Article = require("../models/Article");
const Order = require("../models/Order");

exports.getDashboardStats = async (req, res) => {
  const totalArticles = await Article.countDocuments();
  const publishedArticles = await Article.countDocuments({ status: "published" });
  const draftArticles = await Article.countDocuments({ status: "draft" });

  const totalOrders = await Order.countDocuments();

  const recentArticles = await Article.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("title status createdAt");

  const recentOrders = await Order.find()
    .populate("product", "title type")
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    admin: {
      name: req.admin.name,
      email: req.admin.email,
    },
    stats: {
      totalArticles,
      publishedArticles,
      draftArticles,
      totalOrders,
    },
    recentArticles,
    recentOrders,
  });
};
