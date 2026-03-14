const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // If uploading ebook file (PDF)
    if (file.fieldname === "ebookFile") {
      return {
        folder: "bybs/ebooks",
        resource_type: "raw", // 🔥 REQUIRED FOR PDF
      };
    }

   

    // For cover images
    return {
      folder: "bybs/products",
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
});

module.exports = upload;
