const express = require("express"); 
const protect = require("../../middleware/auth.middleware"); 
const upload = require("../../utils/clodinaryUpload"); 
const{ createProduct, updateProduct, 
    deleteProduct, 
    getAllProducts, 
    getPublicProducts, 
    getProductBySlug, } = require("../../controllers/product.controllers"); 
    

const router = express.Router();


// Public
router.get("/", getPublicProducts);

// Admin routes first
router.get("/admin/all", protect, getAllProducts);

router.post(
  "/admin",
  protect,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "ebookFile", maxCount: 1 },
  ]),
  createProduct
);

router.put(
  "/admin/:id",
  protect,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "ebookFile", maxCount: 1 },
  ]),
  updateProduct
);

router.delete("/admin/:id", protect, deleteProduct);

// 🔥 Dynamic route MUST be last
router.get("/:slug", getProductBySlug);

module.exports = router;