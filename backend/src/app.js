// app.js
require("dotenv").config({ quiet: true });

const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const crypto = require("crypto");
const mongoose = require("mongoose");
const morgan = require("morgan");

const { config, normalizeOrigin } = require("./config/env");
const { errorHandler, notFound } = require("./middleware/error.middleware");
const {
  apiLimiter,
  publicSubmissionLimiter,
  seoPageLimiter,
} = require("./middleware/rateLimit.middleware");

const authRoutes = require("./routes/admin/authRoutes");
const managerRoutes = require("./routes/admin/managerRoutes");
const paymentRoutes = require("./routes/admin/paymentRoutes");
// const orderRoutes = require("./routes/admin/orderRoutes");
const contactRoutes = require("./routes/admin/contactRoutes");
const articleRoutes = require("./routes/admin/articleRoutes");
const dashboardRoutes = require("./routes/admin/dashboardRoutes");
const publicArticleRoutes = require("./routes/public/publicArticle.routes");
const cohortRoutes = require("./routes/admin/cohort.routes");
const publicCohortRoutes = require("./routes/public/public.cohortRoutes");
const publicWaitlistRoutes = require("./routes/public/publicWaitlistRoutes");
const seoRoutes = require("./routes/public/seo.routes");
const seoPageRoutes = require("./routes/public/seoPage.routes");
const waitlistRoutes = require("./routes/admin/waitlistRoutes");
const productRoutes = require("./routes/admin/productRoutes");
const subscriberRoutes = require("./routes/admin/subscriberRoutes");
const fellowshipApplicationRoutes = require("./routes/public/fellowshipApplicationRoutes");
const adminFellowshipApplicationRoutes = require("./routes/admin/fellowshipApplicationRoutes");
const communityActionRoutes = require("./routes/public/communityAction.routes");
const adminCommunityActionRoutes = require("./routes/admin/communityAction.routes");
const reflectionRoutes = require("./routes/public/reflection.routes");
const adminReflectionRoutes = require("./routes/admin/reflection.routes");
const participationRoutes = require("./routes/public/participation.routes");
const adminParticipationRoutes = require("./routes/admin/participation.routes");
const impactMetricRoutes = require("./routes/public/impactMetric.routes");
const adminImpactMetricRoutes = require("./routes/admin/impactMetric.routes");
const testimonialRoutes = require("./routes/public/testimonial.routes");
const adminTestimonialRoutes = require("./routes/admin/testimonial.routes");

const app = express();

const allowedOrigins = new Set([
  ...config.allowedOrigins,
  ...(config.isProduction ? [] : ["http://localhost:5173", "http://127.0.0.1:5173"]),
]);
const isLocalDevelopmentOrigin = (origin) =>
  !config.isProduction && /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

app.disable("x-powered-by");
if (config.trustProxy) {
  app.set("trust proxy", Number(config.trustProxy) || config.trustProxy);
}

app.use((req, res, next) => {
  const requestId = req.get("X-Request-Id") || crypto.randomUUID();
  req.requestId = requestId;
  res.set("X-Request-Id", requestId);
  next();
});

app.use(
  cors({
    origin: function (origin, callback) {
      try {
        const normalizedOrigin = origin ? normalizeOrigin(origin) : "";
        if (!origin || allowedOrigins.has(normalizedOrigin) || isLocalDevelopmentOrigin(origin)) {
          return callback(null, true);
        }
      } catch {
        // Invalid origins are rejected below.
      }

      const error = new Error("Origin is not allowed");
      error.code = "CORS_NOT_ALLOWED";
      return callback(error);
    },
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
    maxAge: 86400,
  })
);

// Core middlewares
app.use(cookieParser());
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(compression());
app.use(
  morgan(config.isProduction ? "combined" : "dev", {
    skip: (req) => req.path === "/health" || req.path === "/api/health",
  })
);
app.use("/api/seo/page", seoPageLimiter, seoPageRoutes);
app.use(apiLimiter);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb", parameterLimit: 100 }));

app.post("/api/contact", publicSubmissionLimiter);
app.post("/api/waitlist", publicSubmissionLimiter);
app.post("/api/fellowship-applications", publicSubmissionLimiter);
app.post("/api/order-requests/request", publicSubmissionLimiter);
app.post("/api/subscribers", publicSubmissionLimiter);

// Routes
app.use("/", seoRoutes);
app.use("/api", seoRoutes);
app.use("/api/admin/auth", authRoutes);
app.use("/api/admin/managers", managerRoutes);
app.use("/api/order-requests", paymentRoutes);
// app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/admin/articles", articleRoutes);

app.use("/api/articles", publicArticleRoutes);
app.use("/api/admin/cohorts", cohortRoutes);
app.use("/api/cohorts", publicCohortRoutes);
app.use("/api/waitlist", publicWaitlistRoutes);
app.use("/api/admin/waitlist", waitlistRoutes);
app.use("/api/fellowship-applications", fellowshipApplicationRoutes);
app.use("/api/admin/fellowship-applications", adminFellowshipApplicationRoutes);
app.use("/api/products", productRoutes);
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/community-actions", communityActionRoutes);
app.use("/api/admin/community-actions", adminCommunityActionRoutes);
app.use("/api/reflections", reflectionRoutes);
app.use("/api/admin/reflections", adminReflectionRoutes);
app.use("/api/participation", participationRoutes);
app.use("/api/admin/participation", adminParticipationRoutes);
app.use("/api/impact-metrics", impactMetricRoutes);
app.use("/api/admin/impact-metrics", adminImpactMetricRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/admin/testimonials", adminTestimonialRoutes);

const healthCheck = (req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;
  res.status(databaseReady ? 200 : 503).json({
    status: databaseReady ? "ok" : "degraded",
    service: "bybs-api",
    database: databaseReady ? "connected" : "unavailable",
  });
};

app.get("/", (req, res) => {
  res.send("BYBS backend running");
});

app.get("/health", healthCheck);
app.get("/api/health", healthCheck);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
