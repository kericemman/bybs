import api from "../utils/axios";

export const fetchActiveReflection = () => api.get("/reflections/prompts/active");
export const fetchPublicReflections = () => api.get("/reflections/prompts");
export const fetchReflection = (slug) => api.get(`/reflections/prompts/${slug}`);
export const fetchPublishedReflections = (slug) =>
  api.get(`/reflections/prompts/${slug}/submissions`);
export const submitReflection = (slug, data) =>
  api.post(`/reflections/prompts/${slug}/submissions`, data);

export const fetchAdminReflectionPrompts = () => api.get("/admin/reflections/prompts");
export const createReflectionPrompt = (data) => api.post("/admin/reflections/prompts", data);
export const updateReflectionPrompt = (id, data) =>
  api.put(`/admin/reflections/prompts/${id}`, data);
export const deleteReflectionPrompt = (id) => api.delete(`/admin/reflections/prompts/${id}`);
export const fetchAdminReflectionSubmissions = (params = {}) =>
  api.get("/admin/reflections/submissions", { params });
export const updateReflectionSubmission = (id, data) =>
  api.patch(`/admin/reflections/submissions/${id}`, data);
