const express = require("express");
const {
  getPublishedArticles,
  getArticleBySlug,
  getArticleReaderCount,
  trackArticleReader,
} = require("../../controllers/publicArticle.controllers");
const { readerHeartbeatLimiter } = require("../../middleware/rateLimit.middleware");

const router = express.Router();

router.get("/", getPublishedArticles);
router.get("/:slug/readers", getArticleReaderCount);
router.post("/:slug/readers/heartbeat", readerHeartbeatLimiter, trackArticleReader);
router.get("/:slug", getArticleBySlug);

module.exports = router;
