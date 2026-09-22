const multer = require("multer");

const notFound = (_req, res) => {
  res.status(404).json({ message: "Route not found" });
};

const errorHandler = (err, _req, res, _next) => {
  const isProduction = process.env.NODE_ENV === "production";
  let status = Number(err.status || err.statusCode) || 500;
  let message = err.message || "Internal server error";

  if (err instanceof multer.MulterError) {
    status = 400;
    message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File is too large. Please upload a file under 20MB."
        : "The uploaded file could not be accepted.";
  } else if (err.type === "entity.too.large") {
    status = 413;
    message = "Request body is too large.";
  } else if (err instanceof SyntaxError && "body" in err) {
    status = 400;
    message = "Request body contains invalid JSON.";
  } else if (err.name === "CastError") {
    status = 400;
    message = "Invalid resource identifier.";
  } else if (err.code === "CORS_NOT_ALLOWED") {
    status = 403;
    message = "Origin is not allowed.";
  }

  if (status >= 500) {
    console.error("Unhandled request error:", err);
  }

  res.status(status).json({
    message: isProduction && status >= 500 ? "Internal server error" : message,
  });
};

module.exports = {
  errorHandler,
  notFound,
};
