const express = require("express");
const {
  getPublishedArticles,
  getArticleBySlug,
  getArticleReaderCount,
  trackArticleReader,
} = require("../../controllers/publicArticle.controllers");

const router = express.Router();

router.get("/", getPublishedArticles);
router.get("/:slug/readers", getArticleReaderCount);
router.post("/:slug/readers/heartbeat", trackArticleReader);
router.get("/:slug", getArticleBySlug);

module.exports = router;
