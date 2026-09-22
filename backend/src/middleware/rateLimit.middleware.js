const rateLimit = require("express-rate-limit");

const createLimiter = ({ windowMs, limit, message, skipSuccessfulRequests = false }) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    skipSuccessfulRequests,
    message: { message },
  });

const apiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  message: "Too many requests. Please try again shortly.",
});

const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  skipSuccessfulRequests: true,
  message: "Too many sign-in attempts. Please try again in 15 minutes.",
});

const publicSubmissionLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 12,
  message: "Too many submissions. Please try again later.",
});

const readerHeartbeatLimiter = createLimiter({
  windowMs: 60 * 1000,
  limit: 120,
  message: "Too many reader updates. Please try again shortly.",
});

module.exports = {
  apiLimiter,
  authLimiter,
  publicSubmissionLimiter,
  readerHeartbeatLimiter,
};
