import api from "../utils/axios";

export const loginAdmin = (credentials) =>
  api.post("/admin/auth/login", credentials);

export const getMe = () => api.get("/admin/auth/me");

export const changeAdminPassword = (data) =>
  api.post("/admin/auth/change-password", data);
