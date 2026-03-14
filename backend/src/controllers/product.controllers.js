const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const slugify = require("slugify");


// ========================================
// 1️⃣ CREATE PRODUCT (ADMIN)
// ========================================
exports.createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      price,
      stock,
    } = req.body;

    if (!title || !type || !price) {
      return res.status(400).json({
        message: "Title, type and price are required",
      });
    }

    if (!["ebook", "merch"].includes(type)) {
      return res.status(400).json({
        message: "Invalid product type",
      });
    }

    let coverImage = null;
    let fileUrl = null;

    // Cover image upload
    if (req.files?.coverImage?.length > 0) {
      coverImage = {
        url: req.files.coverImage[0].path,
        public_id: req.files.coverImage[0].filename,
      };
    }

    // Ebook file upload
    if (type === "ebook" && req.files?.ebookFile?.length > 0) {
      fileUrl = req.files.ebookFile[0].path;
    }

    const product = await Product.create({
      title,
      slug: slugify(title, { lower: true }),
      description,
      type,
      price: Number(price),
      stock: type === "merch" ? Number(stock) : undefined,
      coverImage,
      fileUrl,
      createdBy: req.admin._id,
    });

    res.status(201).json(product);

  } catch (error) {
    console.error("Create product error:");
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);
        console.error("Full object:", error);

    res.status(500).json({ message: "Error creating product" });
  }
};



// ========================================
// 2️⃣ UPDATE PRODUCT (ADMIN)
// ========================================
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const {
      title,
      description,
      price,
      stock,
    } = req.body;

    if (title) {
      product.title = title;
      product.slug = slugify(title, { lower: true });
    }

    if (description) product.description = description;
    if (price) product.price = Number(price);

    if (product.type === "merch" && stock !== undefined) {
      product.stock = Number(stock);
    }

    // Replace cover image
    if (req.files?.coverImage?.length > 0) {
      if (product.coverImage?.public_id) {
        await cloudinary.uploader.destroy(product.coverImage.public_id);
      }

      product.coverImage = {
        url: req.files.coverImage[0].path,
        public_id: req.files.coverImage[0].filename,
      };
    }

    // Replace ebook file
    if (product.type === "ebook" && req.files?.ebookFile?.length > 0) {
      product.fileUrl = req.files.ebookFile[0].path;
    }

    await product.save();

    res.json(product);

  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Error updating product" });
  }
};



// ========================================
// 3️⃣ DELETE PRODUCT (ADMIN)
// ========================================
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete cover image from Cloudinary
    if (product.coverImage?.public_id) {
      await cloudinary.uploader.destroy(product.coverImage.public_id);
    }

    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });

  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
};



// ========================================
// 4️⃣ ADMIN — GET ALL PRODUCTS
// ========================================
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 });

    res.json(products);

  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};



// ========================================
// 5️⃣ PUBLIC — GET ALL PRODUCTS
// ========================================
exports.getPublicProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .select("-fileUrl -createdBy")
      .sort({ createdAt: -1 });

    res.json(products);

  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};



// ========================================
// 6️⃣ PUBLIC — GET SINGLE PRODUCT BY SLUG
// ========================================
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
    }).select("-fileUrl -createdBy");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
};
