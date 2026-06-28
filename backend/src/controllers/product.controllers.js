const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const slugify = require("slugify");

const PRODUCT_TYPES = ["ebook", "merch"];

const parsePositiveNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
};

const parseStock = (value) => {
  const number = Number(value);
  return Number.isInteger(number) && number >= 0 ? number : null;
};

const getUpload = (req, fieldName) => req.files?.[fieldName]?.[0] || null;

const buildCoverImage = (file) => ({
  url: file.path,
  public_id: file.filename,
});

const destroyCoverImage = async (publicId) => {
  if (publicId) {
    await cloudinary.uploader.destroy(publicId);
  }
};

const destroyEbookFile = async (publicId) => {
  if (publicId) {
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
  }
};

const handleProductError = (res, error, fallbackMessage) => {
  console.error(fallbackMessage, error);

  if (error?.code === 11000) {
    return res.status(409).json({
      message: "A product with this title already exists. Please use a different title.",
    });
  }

  if (error?.name === "ValidationError") {
    const message = Object.values(error.errors)
      .map((entry) => entry.message)
      .join(" ");
    return res.status(400).json({ message: message || "Product details are invalid." });
  }

  return res.status(500).json({ message: fallbackMessage });
};


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

    const cleanTitle = title?.trim();
    const cleanDescription = description?.trim();
    const parsedPrice = parsePositiveNumber(price);
    const coverUpload = getUpload(req, "coverImage");
    const ebookUpload = getUpload(req, "ebookFile");

    if (!cleanTitle || !cleanDescription || !type || !parsedPrice) {
      return res.status(400).json({
        message: "Title, description, type and a valid price are required.",
      });
    }

    if (!PRODUCT_TYPES.includes(type)) {
      return res.status(400).json({
        message: "Invalid product type.",
      });
    }

    if (!coverUpload) {
      return res.status(400).json({ message: "Cover image is required." });
    }

    let parsedStock;
    if (type === "merch") {
      parsedStock = parseStock(stock);
      if (parsedStock === null) {
        return res.status(400).json({
          message: "Stock must be a whole number of 0 or more.",
        });
      }
    }

    if (type === "ebook" && !ebookUpload) {
      return res.status(400).json({ message: "Ebook PDF file is required." });
    }

    const product = await Product.create({
      title: cleanTitle,
      slug: slugify(cleanTitle, { lower: true, strict: true }),
      description: cleanDescription,
      type,
      price: parsedPrice,
      stock: type === "merch" ? parsedStock : undefined,
      coverImage: buildCoverImage(coverUpload),
      fileUrl: type === "ebook" ? ebookUpload.path : undefined,
      filePublicId: type === "ebook" ? ebookUpload.filename : undefined,
      createdBy: req.admin._id,
    });

    res.status(201).json(product);

  } catch (error) {
    handleProductError(res, error, "Error creating product");
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
      type,
      price,
      stock,
    } = req.body;

    const nextType = type || product.type;

    if (!PRODUCT_TYPES.includes(nextType)) {
      return res.status(400).json({ message: "Invalid product type." });
    }

    if (title) {
      product.title = title.trim();
      product.slug = slugify(title, { lower: true, strict: true });
    }

    if (description !== undefined) {
      product.description = description.trim();
    }

    if (price !== undefined) {
      const parsedPrice = parsePositiveNumber(price);
      if (!parsedPrice) {
        return res.status(400).json({ message: "Price must be greater than 0." });
      }
      product.price = parsedPrice;
    }

    product.type = nextType;

    if (nextType === "merch") {
      if (stock !== undefined) {
        const parsedStock = parseStock(stock);
        if (parsedStock === null) {
          return res.status(400).json({
            message: "Stock must be a whole number of 0 or more.",
          });
        }
        product.stock = parsedStock;
      } else if (product.stock === undefined || product.stock === null) {
        return res.status(400).json({ message: "Stock is required for merchandise." });
      }
    } else {
      product.stock = undefined;
    }

    // Replace cover image
    const coverUpload = getUpload(req, "coverImage");
    if (coverUpload) {
      await destroyCoverImage(product.coverImage?.public_id);

      product.coverImage = buildCoverImage(coverUpload);
    }

    // Replace ebook file
    const ebookUpload = getUpload(req, "ebookFile");
    if (nextType === "ebook") {
      if (ebookUpload) {
        await destroyEbookFile(product.filePublicId);
        product.fileUrl = ebookUpload.path;
        product.filePublicId = ebookUpload.filename;
      } else if (!product.fileUrl) {
        return res.status(400).json({ message: "Ebook PDF file is required." });
      }
    } else if (product.fileUrl || product.filePublicId) {
      await destroyEbookFile(product.filePublicId);
      product.fileUrl = undefined;
      product.filePublicId = undefined;
    }

    await product.save();

    res.json(product);

  } catch (error) {
    handleProductError(res, error, "Error updating product");
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
    await destroyCoverImage(product.coverImage?.public_id);
    await destroyEbookFile(product.filePublicId);

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
