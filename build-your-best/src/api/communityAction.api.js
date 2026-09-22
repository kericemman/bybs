import api from "../utils/axios";

export const fetchAdminCommunityActions = () => api.get("/admin/community-actions");
export const createCommunityAction = (data) => api.post("/admin/community-actions", data);
export const updateCommunityAction = (id, data) => api.put(`/admin/community-actions/${id}`, data);
export const deleteCommunityAction = (id) => api.delete(`/admin/community-actions/${id}`);
export const deleteCommunityActionGalleryImage = (id, imageId) =>
  api.delete(`/admin/community-actions/${id}/gallery/${imageId}`);

export const fetchPublishedCommunityActions = (limit = 20) =>
  api.get("/community-actions", { params: { limit } });
export const fetchFeaturedCommunityAction = () => api.get("/community-actions/featured");
export const fetchCommunityAction = (slug) => api.get(`/community-actions/${slug}`);
