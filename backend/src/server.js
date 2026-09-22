// server.js
require("dotenv").config({ quiet: true });

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const { config, validateEnvironment } = require("./config/env");
const app = require("./app");

let server;
let shuttingDown = false;

const shutdown = async (signal, exitCode = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`${signal} received; closing the API cleanly.`);

  const forceExit = setTimeout(() => {
    console.error("Graceful shutdown timed out.");
    process.exit(1);
  }, config.shutdownTimeoutMs);
  forceExit.unref();

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await mongoose.connection.close(false);
  clearTimeout(forceExit);
  process.exit(exitCode);
};

const startServer = async () => {
  try {
    validateEnvironment();
    await connectDB();
    console.log("Database connected");

    server = app.listen(config.port, config.host, () => {
      console.log(`API listening on http://${config.host}:${config.port}`);
    });
    server.keepAliveTimeout = 5000;
    server.headersTimeout = 15000;
    server.requestTimeout = 120000;
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
  shutdown("unhandledRejection", 1);
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  shutdown("uncaughtException", 1);
});

startServer();
