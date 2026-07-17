const express = require("express"); 
const protect = require("../../middleware/auth.middleware"); 
const { requireAdmin } = require("../../middleware/permission.middleware");
const upload = require("../../utils/clodinaryUpload"); 
const{ createProduct, updateProduct, 
    deleteProduct, 
    getAllProducts, 
    getPublicProducts, 
    getProductBySlug, } = require("../../controllers/product.controllers"); 
    

const router = express.Router();

const productUpload = (req, res, next) => {
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "ebookFile", maxCount: 1 },
  ])(req, res, (error) => {
    if (!error) return next();

    const message = error.code === "LIMIT_FILE_SIZE"
      ? "File is too large. Please upload files under 20MB."
      : error.message || "File upload failed. Please check the file type and try again.";

    return res.status(400).json({ message });
  });
};


// Public
router.get("/", getPublicProducts);

// Admin routes first
router.get("/admin/all", protect, requireAdmin, getAllProducts);

router.post(
  "/admin",
  protect,
  requireAdmin,
  productUpload,
  createProduct
);

router.put(
  "/admin/:id",
  protect,
  requireAdmin,
  productUpload,
  updateProduct
);

router.delete("/admin/:id", protect, requireAdmin, deleteProduct);

// 🔥 Dynamic route MUST be last
router.get("/:slug", getProductBySlug);

module.exports = router;
