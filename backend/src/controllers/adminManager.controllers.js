const Admin = require("../models/Admin");
const resend = require("../utils/resendClient");

const managerPermissions = ["applications:screen", "articles:manage"];
const FROM_EMAIL = process.env.FROM_EMAIL || "BYBS Admin <no-reply@updates.buildyourbestself.org>";
const FRONTEND_URL = (process.env.FRONTEND_URL || "https://buildyourbestself.org").replace(/\/$/, "");

const sanitizeManager = (admin) => ({
  _id: admin._id,
  name: admin.name,
  email: admin.email,
  role: admin.role,
  permissions: admin.permissions || [],
  mustChangePassword: admin.mustChangePassword === true,
  active: admin.active !== false,
  createdAt: admin.createdAt,
  updatedAt: admin.updatedAt,
});

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const buildWelcomeEmail = ({ manager, password }) => {
  const permissionList = (manager.permissions || [])
    .map((permission) => `<li>${escapeHtml(permission)}</li>`)
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;background:#f6f8fb;padding:30px 0;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
        <div style="background:#00337C;color:#ffffff;padding:28px 30px;">
          <h1 style="margin:0;font-size:24px;font-weight:400;">BYBS Admin Manager Access</h1>
          <p style="margin:8px 0 0;color:#dbeafe;">Your manager account has been created.</p>
        </div>
        <div style="padding:30px;color:#1f2937;line-height:1.7;">
          <p>Hello ${escapeHtml(manager.name || "there")},</p>
          <p>You have been added as a BYBS admin manager. Use the temporary password below to sign in.</p>
          <div style="background:#f3f6fb;border:1px solid #dbe4f0;border-radius:10px;padding:18px;margin:20px 0;">
            <p style="margin:0 0 8px;font-size:13px;color:#64748b;">Login</p>
            <p style="margin:0 0 12px;"><a href="${FRONTEND_URL}/admin/login" style="color:#00337C;">${FRONTEND_URL}/admin/login</a></p>
            <p style="margin:0 0 8px;font-size:13px;color:#64748b;">Email</p>
            <p style="margin:0 0 12px;font-weight:700;">${escapeHtml(manager.email)}</p>
            <p style="margin:0 0 8px;font-size:13px;color:#64748b;">Temporary password</p>
            <p style="margin:0;font-size:20px;font-weight:700;letter-spacing:.4px;">${escapeHtml(password)}</p>
          </div>
          <p>For security, you will be asked to create a new password immediately after your first login.</p>
          ${permissionList ? `<p style="margin-bottom:8px;">Your enabled permissions:</p><ul>${permissionList}</ul>` : ""}
          <p style="margin-top:28px;">Warmly,<br/><strong>BYBS Team</strong></p>
        </div>
      </div>
    </div>
  `;
};

const sendWelcomeEmail = async (manager, password) => {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [manager.email],
    subject: "Your BYBS admin manager account",
    html: buildWelcomeEmail({ manager, password }),
  });

  if (error) {
    const message = error.message || "Resend rejected the manager welcome email.";
    const detail = error.name ? `${error.name}: ${message}` : message;
    throw new Error(detail);
  }

  return data;
};

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

    if (password.trim().length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    const manager = await Admin.create({
      name: name?.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      role: "manager",
      permissions: normalizePermissions(req.body.permissions),
      active: normalizeBoolean(req.body.active),
      mustChangePassword: true,
    });

    let emailSent = false;
    let emailError = "";

    try {
      await sendWelcomeEmail(manager, password.trim());
      emailSent = true;
    } catch (sendError) {
      console.error("Manager welcome email error:", sendError);
      emailError = sendError.message || "Manager account created, but welcome email was not sent.";
    }

    return res.status(201).json({
      ...sanitizeManager(manager),
      emailSent,
      emailError,
    });
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
    const passwordChanged = Boolean(req.body.password?.trim());
    if (passwordChanged) {
      if (req.body.password.trim().length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters." });
      }
      manager.password = req.body.password.trim();
      manager.mustChangePassword = true;
    }

    await manager.save();

    let emailSent = false;
    let emailError = "";

    if (passwordChanged) {
      try {
        await sendWelcomeEmail(manager, req.body.password.trim());
        emailSent = true;
      } catch (sendError) {
        console.error("Manager password reset email error:", sendError);
        emailError = sendError.message || "Manager updated, but reset email was not sent.";
      }
    }

    return res.json({
      ...sanitizeManager(manager),
      emailSent,
      emailError,
    });
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
