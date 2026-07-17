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
        resource_type: "raw",
        allowed_formats: ["pdf"],
      };
    }

    if (file.fieldname === "coverImage" && req.originalUrl?.includes("/articles")) {
      return {
        folder: "bybs/articles",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
      };
    }

    if (file.fieldname === "contentImage" && req.originalUrl?.includes("/articles")) {
      return {
        folder: "bybs/articles/content",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
      };
    }

    if (file.fieldname === "inviteImage" && req.originalUrl?.includes("/fellowship-applications")) {
      return {
        folder: "bybs/fellowship/invitations",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
      };
    }

    if (file.fieldname === "coverImage" && req.originalUrl?.includes("/cohorts")) {
      return {
        folder: "bybs/cohorts/covers",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
      };
    }

    if (["gallery", "graduateGallery"].includes(file.fieldname)) {
      return {
        folder: "bybs/cohorts/gallery",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
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
