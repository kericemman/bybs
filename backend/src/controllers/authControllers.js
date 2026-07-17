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
    token,
  });
};


exports.getMe = async (req, res) => {
  res.status(200).json(req.admin);
};
