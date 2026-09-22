const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const { AUTH_COOKIE_NAME } = require("../utils/authCookie");

const protect = async (req, res, next) => {
  let token = req.cookies?.[AUTH_COOKIE_NAME];

  if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    req.admin = await Admin.findById(decoded.id).select("-password");

    if (!req.admin || req.admin.active === false) {
      return res.status(401).json({ message: "Admin account is not active" });
    }

    if (
      req.admin.passwordChangedAt &&
      decoded.iat * 1000 < req.admin.passwordChangedAt.getTime() - 1000
    ) {
      return res.status(401).json({ message: "Please sign in again" });
    }

    res.set("Cache-Control", "no-store");
    next();
  } catch {
    res.status(401).json({ message: "Session is invalid or has expired" });
  }
};

module.exports = protect;
