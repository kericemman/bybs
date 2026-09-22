const path = require("node:path");

module.exports = {
  apps: [
    {
      name: "bybs-api",
      cwd: path.join(__dirname, "backend"),
      script: "src/server.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      kill_timeout: 12000,
      listen_timeout: 15000,
      time: true,
      env_production: {
        NODE_ENV: "production",
        HOST: "127.0.0.1",
        PORT: "5002",
        TRUST_PROXY: "1",
      },
    },
  ],
};
