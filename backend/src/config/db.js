const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.set("sanitizeFilter", true);
  mongoose.set("strictQuery", true);

  await mongoose.connect(process.env.MONGO_URI, {
    autoIndex: process.env.NODE_ENV !== "production",
    serverSelectionTimeoutMS: 10000,
  });
};

module.exports = connectDB;
