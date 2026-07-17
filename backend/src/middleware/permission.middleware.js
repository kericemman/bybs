const hasPermission = (admin, permission) => {
  if (!admin) return false;
  if (admin.role === "admin") return true;
  return Array.isArray(admin.permissions) && admin.permissions.includes(permission);
};

const requirePermission = (permission) => (req, res, next) => {
  if (hasPermission(req.admin, permission)) return next();

  return res.status(403).json({
    message: "You do not have permission to perform this action.",
  });
};

const requireAdmin = (req, res, next) => {
  if (req.admin?.role === "admin") return next();

  return res.status(403).json({
    message: "Only full admins can perform this action.",
  });
};

module.exports = {
  hasPermission,
  requireAdmin,
  requirePermission,
};
