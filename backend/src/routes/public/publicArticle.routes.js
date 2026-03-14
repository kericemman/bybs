const express = require("express");
const {
  getPublishedArticles,
  getArticleBySlug,
} = require("../../controllers/publicArticle.controllers");

const router = express.Router();

router.get("/", getPublishedArticles);
router.get("/:slug", getArticleBySlug);

module.exports = router;
