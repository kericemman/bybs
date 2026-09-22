const Article = require("../models/Article");
const mongoose = require("mongoose");
const sanitizeRichText = require("../utils/sanitizeRichText");

const ACTIVE_READER_TTL_MS = 45 * 1000;
const articleReaders = new Map();

const createExcerpt = (html = "", maxLength = 160) => {
  const plainText = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (plainText.length <= maxLength) return plainText;
  return `${plainText.slice(0, maxLength).trim()}...`;
};

const getActiveReaderCount = (slug) => {
  const now = Date.now();
  const readers = articleReaders.get(slug);

  if (!readers) return 0;

  for (const [sessionId, lastSeen] of readers.entries()) {
    if (now - lastSeen > ACTIVE_READER_TTL_MS) {
      readers.delete(sessionId);
    }
  }

  if (readers.size === 0) {
    articleReaders.delete(slug);
    return 0;
  }

  return readers.size;
};

exports.getPublishedArticles = async (req, res) => {
  const articles = await Article.find({ status: "published" })
    .sort({ publishedAt: -1, createdAt: -1 })
    .select(
      "title slug excerpt description authorName authorRole authorBio authorImage category tags content coverImage socialImage seoTitle metaDescription publishedAt createdAt updatedAt"
    )
    .lean();

  const articlesWithExcerpt = articles.map((article) => {
    const { content, ...publicArticle } = article;
    const excerpt = article.excerpt || article.description || createExcerpt(content);

    return {
      ...publicArticle,
      category: article.category || "Personal Growth",
      excerpt,
      description: article.description || excerpt,
    };
  });

  res.status(200).json(articlesWithExcerpt);
};

exports.getArticleBySlug = async (req, res) => {
  const article = await Article.findOne({
    slug: req.params.slug,
    status: "published",
  })
    .populate({
      path: "linkedReflection",
      match: { status: mongoose.trusted({ $in: ["active", "closed"] }) },
      select: "title slug question description weekLabel opensAt closesAt status featuredImage",
    })
    .lean();

  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  const excerpt = article.excerpt || article.description || createExcerpt(article.content, 180);

  const linkedReflection = article.linkedReflection
    ? {
        ...article.linkedReflection,
        canSubmit:
          article.linkedReflection.status === "active" &&
          new Date(article.linkedReflection.opensAt) <= new Date() &&
          new Date(article.linkedReflection.closesAt) >= new Date(),
      }
    : null;

  res.status(200).json({
    ...article,
    content: sanitizeRichText(article.content),
    category: article.category || "Personal Growth",
    linkedReflection,
    excerpt,
    description: article.description || excerpt,
    activeReaders: getActiveReaderCount(article.slug),
  });
};

exports.trackArticleReader = async (req, res) => {
  const { slug } = req.params;
  const { sessionId } = req.body;

  if (typeof sessionId !== "string" || !/^[A-Za-z0-9_-]{8,80}$/.test(sessionId)) {
    return res.status(400).json({ message: "Reader session is required" });
  }

  const article = await Article.findOne({ slug, status: "published" }).select("_id slug").lean();

  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  if (!articleReaders.has(slug)) {
    articleReaders.set(slug, new Map());
  }

  articleReaders.get(slug).set(sessionId, Date.now());

  res.status(200).json({
    activeReaders: getActiveReaderCount(slug),
  });
};

exports.getArticleReaderCount = async (req, res) => {
  res.status(200).json({
    activeReaders: getActiveReaderCount(req.params.slug),
  });
};
