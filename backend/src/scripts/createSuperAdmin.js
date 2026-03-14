const mongoose = require("mongoose");
const readline = require("readline");
require("dotenv").config();

const Admin = require("../models/Admin");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question) =>
  new Promise((resolve) => rl.question(question, resolve));

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const email = await ask("kericemman@gmail.com ");
    const password = await ask("Emman@2025 ");

    const exists = await Admin.findOne({ email });
    if (exists) {
      console.log("❌ Admin already exists");
      process.exit(1);
    }

    await Admin.create({ email, password });
    console.log("✅ Admin created successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
