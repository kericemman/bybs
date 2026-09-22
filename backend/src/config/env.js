const isProduction = process.env.NODE_ENV === "production";

const parsePositiveInteger = (value, fallback, key) => {
  if (value === undefined || value === "") return fallback;

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${key} must be a positive integer`);
  }

  return parsed;
};

const normalizeOrigin = (value) => {
  if (!value) return "";

  try {
    return new URL(value).origin;
  } catch {
    throw new Error(`Invalid browser origin: ${value}`);
  }
};

const rawOrigins = [process.env.FRONTEND_URL, process.env.CORS_ORIGIN, process.env.CORS_ORIGINS]
  .filter(Boolean)
  .flatMap((value) => value.split(","))
  .map((value) => value.trim())
  .filter(Boolean);

const config = {
  isProduction,
  port: parsePositiveInteger(process.env.PORT, 5000, "PORT"),
  host: process.env.HOST || (isProduction ? "127.0.0.1" : "0.0.0.0"),
  trustProxy: process.env.TRUST_PROXY || (isProduction ? "1" : ""),
  frontendUrl: process.env.FRONTEND_URL?.replace(/\/$/, "") || "",
  allowedOrigins: [...new Set(rawOrigins.map(normalizeOrigin))],
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
  authCookieMaxAgeMs: parsePositiveInteger(
    process.env.AUTH_COOKIE_MAX_AGE_MS,
    8 * 60 * 60 * 1000,
    "AUTH_COOKIE_MAX_AGE_MS"
  ),
  shutdownTimeoutMs: parsePositiveInteger(
    process.env.SHUTDOWN_TIMEOUT_MS,
    10000,
    "SHUTDOWN_TIMEOUT_MS"
  ),
};

const validateEnvironment = () => {
  const requiredInProduction = [
    "MONGO_URI",
    "JWT_SECRET",
    "FRONTEND_URL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_SECRET_KEY",
    "RESEND_API_KEY",
    "FROM_EMAIL",
    "ADMIN_EMAIL",
  ];
  const missing = requiredInProduction.filter((key) => !process.env[key]?.trim());

  if (isProduction && missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  if (isProduction && (process.env.JWT_SECRET || "").length < 48) {
    throw new Error("JWT_SECRET must contain at least 48 characters in production");
  }

  if (isProduction && config.frontendUrl && !config.frontendUrl.startsWith("https://")) {
    throw new Error("FRONTEND_URL must use HTTPS in production");
  }

  if (isProduction && config.allowedOrigins.some((origin) => !origin.startsWith("https://"))) {
    throw new Error("All production CORS origins must use HTTPS");
  }

  return config;
};

module.exports = {
  config,
  normalizeOrigin,
  validateEnvironment,
};
