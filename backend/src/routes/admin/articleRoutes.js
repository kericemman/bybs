const express = require("express");
const protect = require("../../middleware/auth.middleware");
const upload = require("../../utils/clodinaryUpload");

const {
  createArticle,
  getArticles,
  getArticle,
  updateArticle,
  deleteArticle,
} = require("../../controllers/articleControllers");

const router = express.Router();

// 🔒 Protect ALL article routes
router.use(protect);

// GET all articles (admin dashboard)
router.get("/", getArticles);

// GET single article by ID (edit/view)
router.get("/:id", getArticle);

// CREATE article
router.post("/", upload.single("coverImage"), createArticle);

// UPDATE article
router.put("/:id", upload.single("coverImage"), updateArticle);

// DELETE article
router.delete("/:id", deleteArticle);

module.exports = router;
