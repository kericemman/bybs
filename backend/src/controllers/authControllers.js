const Admin = require("../models/Admin");
const generateToken = require("../utils/generateToken");
const { clearAuthCookie, setAuthCookie } = require("../utils/authCookie");

const adminResponse = (admin) => ({
  _id: admin._id,
  name: admin.name,
  email: admin.email,
  role: admin.role,
  permissions: admin.permissions || [],
  mustChangePassword: admin.mustChangePassword === true,
});

exports.loginAdmin = async (req, res) => {
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";

  if (!email || !password || email.length > 254 || password.length > 128) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (admin.active === false) {
    return res.status(403).json({ message: "This admin account is inactive" });
  }

  const isMatch = await admin.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken(admin._id);
  setAuthCookie(res, token);

  res.status(200).json(adminResponse(admin));
};

exports.getMe = async (req, res) => {
  res.status(200).json(adminResponse(req.admin));
};

exports.logoutAdmin = (_req, res) => {
  clearAuthCookie(res);
  res.status(204).end();
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (typeof newPassword !== "string" || newPassword.length < 12 || newPassword.length > 128) {
      return res.status(400).json({ message: "New password must be at least 12 characters." });
    }

    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      return res.status(404).json({ message: "Admin account not found." });
    }

    if (!admin.mustChangePassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required." });
      }

      if (typeof currentPassword !== "string" || currentPassword.length > 128) {
        return res.status(400).json({ message: "Current password is invalid." });
      }

      const isMatch = await admin.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ message: "Current password is incorrect." });
      }
    }

    admin.password = newPassword;
    admin.mustChangePassword = false;
    admin.passwordChangedAt = new Date();
    await admin.save();

    setAuthCookie(res, generateToken(admin._id));

    return res.json(adminResponse(admin));
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ message: "Unable to change password." });
  }
};
