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


export const getDashboardData = () =>
    api.get("/admin/dashboard");

export const fetchPayments = () =>
    api.get("/admin/payments");
  
  export const fetchPaymentStats = () =>
    api.get("/admin/payments/stats");
  
  export const syncPayments = () =>
    api.post("/admin/payments/sync");