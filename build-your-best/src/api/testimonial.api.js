import api from "../utils/axios";

export const fetchPublicTestimonials = (limit = 12) =>
  api.get("/testimonials", { params: { limit } });

export const submitTestimonial = (formData) =>
  api.post("/testimonials", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const fetchAdminTestimonials = (params = {}) => api.get("/admin/testimonials", { params });

export const updateAdminTestimonial = (id, data) => api.patch(`/admin/testimonials/${id}`, data);

export const deleteAdminTestimonial = (id) => api.delete(`/admin/testimonials/${id}`);
