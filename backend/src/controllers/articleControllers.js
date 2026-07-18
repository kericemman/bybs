const Article = require("../models/Article");
const cloudinary = require("../config/cloudinary");
const { sendArticleNewsletter } = require("../utils/articleNewsletterEmail");

const createExcerpt = (html = "", maxLength = 160) => {
  const plainText = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (plainText.length <= maxLength) return plainText;
  return `${plainText.slice(0, maxLength).trim()}...`;
};

const markNewsletterAttempt = async (article, result = {}) => {
  article.newsletter = {
    ...(article.newsletter?.toObject?.() || article.newsletter || {}),
    lastAttemptAt: new Date(),
    recipientCount: result.recipientCount || 0,
    failedCount: result.failedCount || 0,
    emailIds: result.emailIds || [],
    error: result.error || "",
    ...(result.sent ? { sentAt: new Date() } : {}),
  };

  await article.save();
};

const notifySubscribersOnPublish = async (article) => {
  if (article.status !== "published" || article.newsletter?.sentAt) return null;

  try {
    const result = await sendArticleNewsletter(article);
    await markNewsletterAttempt(article, result);
    return result;
  } catch (error) {
    console.error("Article newsletter error:", error);
    const result = {
      sent: false,
      recipientCount: 0,
      emailIds: [],
      error: error.message || "Failed to send article newsletter.",
    };
    await markNewsletterAttempt(article, result);
    return result;
  }
};

exports.createArticle = async (req, res) => {
  try {
    const { title, content, excerpt, description, status, slug } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Cover image is required" });
    }

    const summary =
      excerpt?.trim() || description?.trim() || createExcerpt(content);

    const article = await Article.create({
      title: title.trim(),
      slug,
      content,
      excerpt: summary,
      description: summary,
      status,
      coverImage: {
        url: req.file.path,
        public_id: req.file.filename,
      },
      createdBy: req.admin._id,
    });

    const newsletterNotification =
      article.status === "published" ? await notifySubscribersOnPublish(article) : null;

    res.status(201).json({
      ...article.toObject(),
      newsletterNotification,
    });
  } catch (error) {
    console.error("Create article error:", error);

    if (error.code === 11000) {
      return res.status(409).json({ message: "An article with this slug already exists" });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Failed to create article" });
  }
};

exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch articles" });
  }
};

exports.getArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch article" });
  }
};

exports.uploadArticleContentImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    res.status(201).json({
      url: req.file.path,
      public_id: req.file.filename,
    });
  } catch (error) {
    console.error("Upload article content image error:", error);
    res.status(500).json({ message: "Failed to upload image" });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const wasPublished = article.status === "published";

    if (req.file) {
      if (article.coverImage?.public_id) {
        await cloudinary.uploader.destroy(article.coverImage.public_id);
      }

      article.coverImage = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    const summary =
      req.body.excerpt?.trim() ||
      req.body.description?.trim() ||
      createExcerpt(req.body.content || article.content);

    article.title = req.body.title?.trim() || article.title;
    article.slug = req.body.slug || article.slug;
    article.content = req.body.content || article.content;
    article.excerpt = summary ?? article.excerpt;
    article.description = summary ?? article.description;
    article.status = req.body.status || article.status;

    await article.save();
    const newsletterNotification =
      !wasPublished && article.status === "published"
        ? await notifySubscribersOnPublish(article)
        : null;

    res.status(200).json({
      ...article.toObject(),
      newsletterNotification,
    });
  } catch (error) {
    console.error("Update article error:", error);

    if (error.code === 11000) {
      return res.status(409).json({ message: "An article with this slug already exists" });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Failed to update article" });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (article.coverImage?.public_id) {
      await cloudinary.uploader.destroy(article.coverImage.public_id);
    }

    await article.deleteOne();

    res.status(200).json({ message: "Article deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete article" });
  }
};
