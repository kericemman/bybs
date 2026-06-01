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









const app = express();

// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://buildyourbestselfblog.com",
//   "https://www.buildyourbestselfblog.com",
//   "www.buildyourbestselfblog.com",
// ];


// app.use(cors({
//   origin: function(origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("CORS blocked"));
//     }
//   },
//   credentials: true
// }));

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true
}));

// Core middlewares
app.use(cookieParser());
app.use(helmet());
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
app.use("/api/products", productRoutes);
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/charity-merch", charityMerchRoutes);







app.use(express.json({ limit: "20mb" }));

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({
    message: err.message,
  });
});


app.get("/", (req, res) => {
  res.send("BYBS backend running");
});


module.exports = app;
