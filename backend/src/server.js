// server.js
require("dotenv").config();

const connectDB = require("./config/db");
const app = require("./app");

const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";

const validateEnvironment = () => {
  const requiredInProduction = ["MONGO_URI", "JWT_SECRET", "FRONTEND_URL"];
  const missing = requiredInProduction.filter((key) => !process.env[key]);

  if (isProduction && missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  if (
    isProduction &&
    process.env.JWT_SECRET === "bybs_super_secure_jwt_secret_change_this_to_long_random_string"
  ) {
    throw new Error("JWT_SECRET must be replaced before production deployment");
  }
};

const startServer = async () => {
  try {
    validateEnvironment();
    await connectDB();
    console.log("✅ Database connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
