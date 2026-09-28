const express = require("express");
const protect = require("../../middleware/auth.middleware");
const { requireAdmin } = require("../../middleware/permission.middleware");
const upload = require("../../utils/clodinaryUpload");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getPublicProducts,
  getProductBySlug,
} = require("../../controllers/product.controllers");
const {
  requestFreeEbook,
  downloadFreeEbook,
} = require("../../controllers/ebookDownload.controllers");

const router = express.Router();
const MAX_PRODUCT_REQUEST_BYTES = 64 * 1024 * 1024;

const enforceProductRequestSize = (req, res, next) => {
  const contentLength = Number(req.get("content-length"));

  if (Number.isFinite(contentLength) && contentLength > MAX_PRODUCT_REQUEST_BYTES) {
    return res.status(413).json({
      message: "The combined product upload must be under 60MB.",
    });
  }

  return next();
};

const productUpload = (req, res, next) => {
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "productImages", maxCount: 6 },
    { name: "ebookFile", maxCount: 1 },
  ])(req, res, (error) => {
    if (!error) return next();

    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "File is too large. Please upload files under 20MB."
        : error.message || "File upload failed. Please check the file type and try again.";

    return res.status(400).json({ message });
  });
};

// Public
router.get("/", getPublicProducts);
router.post("/:slug/free-download", requestFreeEbook);
router.get("/download/:token", downloadFreeEbook);

// Admin routes first
router.get("/admin/all", protect, requireAdmin, getAllProducts);

router.post(
  "/admin",
  protect,
  requireAdmin,
  enforceProductRequestSize,
  productUpload,
  createProduct
);

router.put(
  "/admin/:id",
  protect,
  requireAdmin,
  enforceProductRequestSize,
  productUpload,
  updateProduct
);

router.delete("/admin/:id", protect, requireAdmin, deleteProduct);

// 🔥 Dynamic route MUST be last
router.get("/:slug", getProductBySlug);

module.exports = router;
