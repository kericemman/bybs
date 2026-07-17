const Admin = require("../models/Admin");
const generateToken = require("../utils/generateToken");

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

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

  res.status(200).json({
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    permissions: admin.permissions || [],
    mustChangePassword: admin.mustChangePassword === true,
    token,
  });
};


exports.getMe = async (req, res) => {
  res.status(200).json(req.admin);
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || String(newPassword).length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters." });
    }

    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      return res.status(404).json({ message: "Admin account not found." });
    }

    if (!admin.mustChangePassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required." });
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

    return res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions || [],
      mustChangePassword: false,
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ message: "Unable to change password." });
  }
};
