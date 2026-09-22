import api from "../utils/axios";

export const submitParticipation = (data) => api.post("/participation", data);
export const fetchParticipationApplications = (params = {}) =>
  api.get("/admin/participation", { params });
export const updateParticipationApplication = (id, data) =>
  api.patch(`/admin/participation/${id}`, data);
