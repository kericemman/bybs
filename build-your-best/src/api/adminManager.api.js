import api from "../utils/axios";

export const getAdminManagers = () => api.get("/admin/managers");

export const createAdminManager = (data) => api.post("/admin/managers", data);

export const updateAdminManager = (id, data) => api.put(`/admin/managers/${id}`, data);

export const deleteAdminManager = (id) => api.delete(`/admin/managers/${id}`);
