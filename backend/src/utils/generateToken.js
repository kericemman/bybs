const jwt = require("jsonwebtoken");
const { config } = require("../config/env");

const generateToken = (adminId) => {
  return jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
    expiresIn: config.jwtExpiresIn,
    algorithm: "HS256",
  });
};

module.exports = generateToken;
