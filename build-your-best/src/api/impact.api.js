import api from "../utils/axios";

export const fetchImpactMetrics = () => api.get("/impact-metrics");
export const fetchAdminImpactMetrics = () => api.get("/admin/impact-metrics");
export const createImpactMetric = (data) => api.post("/admin/impact-metrics", data);
export const updateImpactMetric = (id, data) => api.put(`/admin/impact-metrics/${id}`, data);
export const deleteImpactMetric = (id) => api.delete(`/admin/impact-metrics/${id}`);
