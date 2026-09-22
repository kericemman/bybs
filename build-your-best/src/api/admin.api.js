import api from "../utils/axios";

/**
 * ADMIN LOGIN
 */
export const adminLogin = (credentials) => {
  return api.post("/admin/auth/login", credentials);
};

/**
 * OPTIONAL (future-proof)
 * Fetch current admin profile
 */
export const getAdminProfile = () => {
  return api.get("/admin/auth/me");
};

export const getDashboardData = () => api.get("/admin/dashboard");
