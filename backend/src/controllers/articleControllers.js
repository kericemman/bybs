const Article = require("../models/Article");
const cloudinary = require("../config/cloudinary");

exports.createArticle = async (req, res) => {
  const { title, content, status } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Cover image is required" });
  }

  const article = await Article.create({
    title,
    content,
    status,
    coverImage: {
      url: req.file.path,
      public_id: req.file.filename,
    },
    createdBy: req.admin._id,
  });

  res.status(201).json(article);
};

exports.getArticles = async (req, res) => {
  const articles = await Article.find().sort({ createdAt: -1 });
  res.status(200).json(articles);
};

exports.getArticle = async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }
  res.status(200).json(article);
};

exports.updateArticle = async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  if (req.file) {
    await cloudinary.uploader.destroy(article.coverImage.public_id);
    article.coverImage = {
      url: req.file.path,
      public_id: req.file.filename,
    };
  }

  article.title = req.body.title || article.title;
  article.content = req.body.content || article.content;
  article.status = req.body.status || article.status;

  await article.save();
  res.status(200).json(article);
};

exports.deleteArticle = async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  await cloudinary.uploader.destroy(article.coverImage.public_id);
  await article.deleteOne();

  res.status(200).json({ message: "Article deleted" });
};
