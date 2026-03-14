import api from "../utils/axios";

export const loginAdmin = (credentials) =>
  api.post("/admin/auth/login", credentials);

export const getMe = () => api.get("/admin/auth/me");