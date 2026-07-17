const Admin = require("../models/Admin");

const managerPermissions = ["applications:screen", "articles:manage"];

const sanitizeManager = (admin) => ({
  _id: admin._id,
  name: admin.name,
  email: admin.email,
  role: admin.role,
  permissions: admin.permissions || [],
  active: admin.active !== false,
  createdAt: admin.createdAt,
  updatedAt: admin.updatedAt,
});

const normalizePermissions = (permissions = managerPermissions) => {
  const list = Array.isArray(permissions) ? permissions : [permissions];
  return list.filter((permission) => managerPermissions.includes(permission));
};

const normalizeBoolean = (value, fallback = true) => {
  if (value === undefined) return fallback;
  return value === true || value === "true" || value === "1" || value === "on";
};

exports.getManagers = async (_req, res) => {
  try {
    const managers = await Admin.find({ role: "manager" })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.json(managers.map(sanitizeManager));
  } catch (error) {
    console.error("Get managers error:", error);
    return res.status(500).json({ message: "Unable to fetch admin managers." });
  }
};

exports.createManager = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const manager = await Admin.create({
      name: name?.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: "manager",
      permissions: normalizePermissions(req.body.permissions),
      active: normalizeBoolean(req.body.active),
    });

    return res.status(201).json(sanitizeManager(manager));
  } catch (error) {
    console.error("Create manager error:", error);

    if (error.code === 11000) {
      return res.status(409).json({ message: "An admin with this email already exists." });
    }

    return res.status(500).json({ message: "Unable to create admin manager." });
  }
};

exports.updateManager = async (req, res) => {
  try {
    const manager = await Admin.findOne({ _id: req.params.id, role: "manager" });

    if (!manager) {
      return res.status(404).json({ message: "Admin manager not found." });
    }

    if (req.body.name !== undefined) manager.name = req.body.name?.trim();
    if (req.body.email !== undefined) manager.email = req.body.email.trim().toLowerCase();
    if (req.body.permissions !== undefined) manager.permissions = normalizePermissions(req.body.permissions);
    if (req.body.active !== undefined) manager.active = normalizeBoolean(req.body.active);
    if (req.body.password?.trim()) manager.password = req.body.password;

    await manager.save();
    return res.json(sanitizeManager(manager));
  } catch (error) {
    console.error("Update manager error:", error);

    if (error.code === 11000) {
      return res.status(409).json({ message: "An admin with this email already exists." });
    }

    return res.status(500).json({ message: "Unable to update admin manager." });
  }
};

exports.deleteManager = async (req, res) => {
  try {
    const manager = await Admin.findOne({ _id: req.params.id, role: "manager" });

    if (!manager) {
      return res.status(404).json({ message: "Admin manager not found." });
    }

    await manager.deleteOne();
    return res.json({ message: "Admin manager deleted." });
  } catch (error) {
    console.error("Delete manager error:", error);
    return res.status(500).json({ message: "Unable to delete admin manager." });
  }
};
