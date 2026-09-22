export const PERMISSIONS = {
  APPLICATIONS_SCREEN: "applications:screen",
  ARTICLES_MANAGE: "articles:manage",
};

export const MANAGER_PERMISSIONS = [
  {
    value: PERMISSIONS.APPLICATIONS_SCREEN,
    label: "Screen fellowship applications",
  },
  {
    value: PERMISSIONS.ARTICLES_MANAGE,
    label: "Manage articles",
  },
];

export const isFullAdmin = (admin) => admin?.role === "admin";

export const hasPermission = (admin, permission) => {
  if (!admin) return false;
  if (isFullAdmin(admin)) return true;
  return Array.isArray(admin.permissions) && admin.permissions.includes(permission);
};

export const defaultAdminPath = (admin) => {
  if (admin?.mustChangePassword) return "/admin/change-password";
  if (isFullAdmin(admin)) return "/admin/dashboard";
  if (hasPermission(admin, PERMISSIONS.APPLICATIONS_SCREEN))
    return "/admin/fellowship-applications";
  if (hasPermission(admin, PERMISSIONS.ARTICLES_MANAGE)) return "/admin/articles";
  return "/admin/login";
};
