const Article = require("../models/Article");

exports.getPublishedArticles = async (req, res) => {
  const articles = await Article.find({ status: "published" })
    .sort({ createdAt: -1 })
    .select("title slug coverImage createdAt");

  res.status(200).json(articles);
};

exports.getArticleBySlug = async (req, res) => {
  const article = await Article.findOne({
    slug: req.params.slug,
    status: "published",
  });

  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  res.status(200).json(article);
};
