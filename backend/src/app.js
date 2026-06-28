// app.js
require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const cors = require("cors");

const path = require("path");

const authRoutes = require("./routes/admin/authRoutes");
const paymentRoutes = require("./routes/admin/paymentRoutes");
// const orderRoutes = require("./routes/admin/orderRoutes");
const downloadRoutes = require("./routes/admin/downloadRoutes");
const merchRoutes = require("./routes/admin/merchRoutes");
const coachingRoutes = require("./routes/admin/coachingRoutes");
const contactRoutes = require("./routes/admin/contactRoutes");
const articleRoutes = require("./routes/admin/articleRoutes");
const dashboardRoutes = require("./routes/admin/dashboardRoutes");
const publicArticleRoutes = require("./routes/public/publicArticle.routes");
const cohortRoutes = require("./routes/admin/cohort.routes");
const publicCohortRoutes = require("./routes/public/public.cohortRoutes");
const publicWaitlistRoutes = require("./routes/public/publicWaitlistRoutes");
const waitlistRoutes = require("./routes/admin/waitlistRoutes");
const productRoutes = require("./routes/admin/productRoutes");
const subscriberRoutes = require("./routes/admin/subscriberRoutes");
const charityMerchRoutes = require("./routes/admin/charityMerchRoutes");
const fellowshipApplicationRoutes = require("./routes/public/fellowshipApplicationRoutes");
const adminFellowshipApplicationRoutes = require("./routes/admin/fellowshipApplicationRoutes");

const app = express();

const isProduction = process.env.NODE_ENV === "production";
const envOrigins = [
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN,
  process.env.CORS_ORIGINS,
]
  .filter(Boolean)
  .flatMap((origin) => origin.split(","))
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([
  ...envOrigins,
  ...(isProduction
    ? []
    : ["http://localhost:5173", "http://127.0.0.1:5173"]),
]);
const isLocalDevelopmentOrigin = (origin) =>
  !isProduction && /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.has(origin) || isLocalDevelopmentOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS blocked"));
    }
  },
  credentials: true
}));

// Core middlewares
app.use(cookieParser());
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(compression());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

/*
IMPORTANT: webhook raw body parser FIRST
*/
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

/*
Normal body parsers for the rest of the app
*/
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/admin/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
// app.use("/api/orders", orderRoutes);
app.use("/api/download", downloadRoutes);
app.use("/api/merch", merchRoutes);
app.use("/api/coaching", coachingRoutes);
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
app.use("/api/charity-merch", charityMerchRoutes);

const healthCheck = (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "bybs-api",
    uptime: process.uptime(),
  });
};

app.get("/", (req, res) => {
  res.send("BYBS backend running");
});

app.get("/health", healthCheck);
app.get("/api/health", healthCheck);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, _next) => {
  console.error("GLOBAL ERROR:", err);

  res.status(err.status || 500).json({
    message: isProduction ? "Internal server error" : err.message,
  });
});

module.exports = app;
