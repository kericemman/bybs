const path = require("path");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const uploadParams = (req, file) => {
  if (file.fieldname === "ebookFile") {
    return {
      folder: "bybs/ebooks",
      resource_type: "raw",
      type: "authenticated",
      allowed_formats: ["pdf"],
    };
  }

  const route = req.originalUrl || "";

  if (route.includes("/articles")) {
    const articleFolders = {
      coverImage: "bybs/articles",
      contentImage: "bybs/articles/content",
      socialImage: "bybs/articles/social",
      authorImage: "bybs/articles/authors",
    };
    if (articleFolders[file.fieldname]) {
      return { folder: articleFolders[file.fieldname], resource_type: "image" };
    }
  }

  if (file.fieldname === "inviteImage" && route.includes("/fellowship-applications")) {
    return { folder: "bybs/fellowship/invitations", resource_type: "image" };
  }

  if (route.includes("/community-actions")) {
    return {
      folder:
        file.fieldname === "gallery"
          ? "bybs/community-actions/gallery"
          : "bybs/community-actions/covers",
      resource_type: "image",
    };
  }

  if (route.includes("/reflections")) {
    return {
      folder:
        file.fieldname === "profilePhoto"
          ? "bybs/reflections/community"
          : "bybs/reflections/prompts",
      resource_type: "image",
    };
  }

  if (file.fieldname === "profilePhoto" && route.includes("/testimonials")) {
    return { folder: "bybs/testimonials", resource_type: "image" };
  }

  if (route.includes("/cohorts")) {
    return {
      folder: ["gallery", "graduateGallery"].includes(file.fieldname)
        ? "bybs/cohorts/gallery"
        : "bybs/cohorts/covers",
      resource_type: "image",
    };
  }

  return { folder: "bybs/products", resource_type: "image" };
};

class CloudinaryStorage {
  _handleFile(req, file, callback) {
    const options = uploadParams(req, file);
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return callback(error);

      return callback(null, {
        path: result.secure_url,
        filename: result.public_id,
        size: result.bytes,
        resourceType: options.resource_type,
        deliveryType: options.type || "upload",
      });
    });

    file.stream.pipe(stream);
  }

  _removeFile(_req, file, callback) {
    if (!file.filename) return callback(null);

    cloudinary.uploader.destroy(
      file.filename,
      {
        resource_type: file.resourceType || "image",
        type: file.deliveryType || "upload",
      },
      callback
    );
  }
}

const fileFilter = (_req, file, callback) => {
  const extension = path.extname(file.originalname || "").toLowerCase();

  if (file.fieldname === "ebookFile") {
    const validPdf = file.mimetype === "application/pdf" && extension === ".pdf";
    return callback(validPdf ? null : new Error("Ebook files must be valid PDFs."), validPdf);
  }

  const validImage =
    IMAGE_MIME_TYPES.has(file.mimetype) && [".jpg", ".jpeg", ".png", ".webp"].includes(extension);
  return callback(
    validImage ? null : new Error("Images must be JPG, PNG, or WebP files."),
    validImage
  );
};

module.exports = multer({
  storage: new CloudinaryStorage(),
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
    files: 41,
    fields: 100,
    parts: 141,
  },
});
