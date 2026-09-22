const Article = require("../models/Article");
const WeeklyReflectionPrompt = require("../models/WeeklyReflectionPrompt");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");
const { sendArticleNewsletter } = require("../utils/articleNewsletterEmail");
const sanitizeRichText = require("../utils/sanitizeRichText");

const ARTICLE_CATEGORIES = [
  "Personal Growth",
  "Career",
  "Leadership",
  "Community",
  "Wellbeing",
  "Professional Development",
  "Stories",
];

const uploadedFile = (req, field) => req.files?.[field]?.[0];
const toImage = (file) => (file ? { url: file.path, public_id: file.filename } : undefined);
const normalizeTags = (value) => {
  if (Array.isArray(value)) return value.map((tag) => String(tag).trim()).filter(Boolean);
  return String(value || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};
const destroyImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Article image cleanup error:", error);
  }
};

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
  const coverFile = uploadedFile(req, "coverImage");
  const socialFile = uploadedFile(req, "socialImage");
  const authorFile = uploadedFile(req, "authorImage");
  let articleCreated = false;
  const cleanupUploads = () =>
    Promise.all([
      destroyImage(coverFile?.filename),
      destroyImage(socialFile?.filename),
      destroyImage(authorFile?.filename),
    ]);
  try {
    const { title, content, excerpt, description, status, slug, authorName } = req.body;
    const safeContent = sanitizeRichText(content);

    if (!title?.trim() || !safeContent.trim() || !authorName?.trim()) {
      await cleanupUploads();
      return res.status(400).json({ message: "Title, author, and content are required" });
    }

    if (!coverFile) {
      await cleanupUploads();
      return res.status(400).json({ message: "Cover image is required" });
    }

    if (req.body.category && !ARTICLE_CATEGORIES.includes(req.body.category)) {
      await cleanupUploads();
      return res.status(400).json({ message: "Please select a valid insight category." });
    }

    if (req.body.linkedReflection) {
      const validId = mongoose.isValidObjectId(req.body.linkedReflection);
      const reflectionExists =
        validId &&
        (await WeeklyReflectionPrompt.exists({
          _id: req.body.linkedReflection,
          status: mongoose.trusted({ $ne: "archived" }),
        }));
      if (!reflectionExists) {
        await cleanupUploads();
        return res
          .status(400)
          .json({ message: "The selected weekly reflection is not available." });
      }
    }

    const summary = excerpt?.trim() || description?.trim() || createExcerpt(safeContent);

    const article = await Article.create({
      title: title.trim(),
      slug,
      content: safeContent,
      excerpt: summary,
      description: summary,
      authorName: authorName.trim(),
      authorRole: req.body.authorRole?.trim() || "",
      authorBio: req.body.authorBio?.trim() || "",
      authorImage: toImage(authorFile),
      category: req.body.category || "Personal Growth",
      tags: normalizeTags(req.body.tags),
      seoTitle: req.body.seoTitle?.trim() || "",
      metaDescription: req.body.metaDescription?.trim() || "",
      linkedReflection: req.body.linkedReflection || null,
      status,
      coverImage: toImage(coverFile),
      socialImage: toImage(socialFile),
      createdBy: req.admin._id,
    });
    articleCreated = true;

    const newsletterNotification =
      article.status === "published" ? await notifySubscribersOnPublish(article) : null;

    res.status(201).json({
      ...article.toObject(),
      newsletterNotification,
    });
  } catch (error) {
    console.error("Create article error:", error);
    if (!articleCreated) await cleanupUploads();

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

exports.getReflectionOptions = async (_req, res) => {
  try {
    const prompts = await WeeklyReflectionPrompt.find({
      status: mongoose.trusted({ $ne: "archived" }),
    })
      .select("title question weekLabel slug status reflectionDate")
      .sort({ reflectionDate: -1, createdAt: -1 })
      .lean();
    res.status(200).json(prompts);
  } catch (error) {
    console.error("Article reflection options error:", error);
    res.status(500).json({ message: "Failed to fetch reflection options" });
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
  const coverFile = uploadedFile(req, "coverImage");
  const socialFile = uploadedFile(req, "socialImage");
  const authorFile = uploadedFile(req, "authorImage");
  let articleSaved = false;
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      await Promise.all([
        destroyImage(coverFile?.filename),
        destroyImage(socialFile?.filename),
        destroyImage(authorFile?.filename),
      ]);
      return res.status(404).json({ message: "Article not found" });
    }

    const wasPublished = article.status === "published";
    const previousCoverId = coverFile ? article.coverImage?.public_id : "";
    const previousSocialId = socialFile ? article.socialImage?.public_id : "";
    const previousAuthorId = authorFile ? article.authorImage?.public_id : "";

    if (coverFile) article.coverImage = toImage(coverFile);
    if (socialFile) article.socialImage = toImage(socialFile);
    if (authorFile) article.authorImage = toImage(authorFile);

    if (req.body.category && !ARTICLE_CATEGORIES.includes(req.body.category)) {
      await Promise.all([
        destroyImage(coverFile?.filename),
        destroyImage(socialFile?.filename),
        destroyImage(authorFile?.filename),
      ]);
      return res.status(400).json({ message: "Please select a valid insight category." });
    }

    if (req.body.linkedReflection) {
      const validId = mongoose.isValidObjectId(req.body.linkedReflection);
      const reflectionExists =
        validId &&
        (await WeeklyReflectionPrompt.exists({
          _id: req.body.linkedReflection,
          status: mongoose.trusted({ $ne: "archived" }),
        }));
      if (!reflectionExists) {
        await Promise.all([
          destroyImage(coverFile?.filename),
          destroyImage(socialFile?.filename),
          destroyImage(authorFile?.filename),
        ]);
        return res
          .status(400)
          .json({ message: "The selected weekly reflection is not available." });
      }
    }

    const nextAuthorName = req.body.authorName?.trim() || article.authorName?.trim();
    if (!nextAuthorName) {
      await Promise.all([
        destroyImage(coverFile?.filename),
        destroyImage(socialFile?.filename),
        destroyImage(authorFile?.filename),
      ]);
      return res.status(400).json({ message: "Author name is required" });
    }

    const safeContent = req.body.content ? sanitizeRichText(req.body.content) : article.content;
    if (!safeContent.trim()) {
      await Promise.all([
        destroyImage(coverFile?.filename),
        destroyImage(socialFile?.filename),
        destroyImage(authorFile?.filename),
      ]);
      return res.status(400).json({ message: "Article content cannot be empty" });
    }

    const summary =
      req.body.excerpt?.trim() || req.body.description?.trim() || createExcerpt(safeContent);

    article.title = req.body.title?.trim() || article.title;
    article.slug = req.body.slug || article.slug;
    article.content = safeContent;
    article.excerpt = summary ?? article.excerpt;
    article.description = summary ?? article.description;
    article.authorName = nextAuthorName;
    article.authorRole = req.body.authorRole?.trim() || "";
    article.authorBio = req.body.authorBio?.trim() || "";
    article.category = req.body.category || article.category || "Personal Growth";
    article.tags = normalizeTags(req.body.tags);
    article.seoTitle = req.body.seoTitle?.trim() || "";
    article.metaDescription = req.body.metaDescription?.trim() || "";
    article.linkedReflection = req.body.linkedReflection || null;
    article.status = req.body.status || article.status;

    await article.save();
    articleSaved = true;
    await Promise.all([
      destroyImage(previousCoverId),
      destroyImage(previousSocialId),
      destroyImage(previousAuthorId),
    ]);
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
    if (!articleSaved) {
      await Promise.all([
        destroyImage(coverFile?.filename),
        destroyImage(socialFile?.filename),
        destroyImage(authorFile?.filename),
      ]);
    }

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
      await destroyImage(article.coverImage.public_id);
    }

    if (article.socialImage?.public_id) await destroyImage(article.socialImage.public_id);
    if (article.authorImage?.public_id) await destroyImage(article.authorImage.public_id);

    await article.deleteOne();

    res.status(200).json({ message: "Article deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete article" });
  }
};
