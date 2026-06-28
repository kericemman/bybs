import api from "../utils/axios";

export const submitFellowshipApplication = (data) =>
  api.post("/fellowship-applications", data);

export const getFellowshipApplications = (params = {}) =>
  api.get("/admin/fellowship-applications", { params });

export const updateFellowshipApplication = (id, data) =>
  api.patch(`/admin/fellowship-applications/${id}`, data);

export const sendFellowshipInvite = (id, data) =>
  api.post(`/admin/fellowship-applications/${id}/invite`, data);

export const deleteFellowshipApplication = (id) =>
  api.delete(`/admin/fellowship-applications/${id}`);
