import api from "../utils/axios";

export const submitFellowshipApplication = (data) =>
  api.post("/fellowship-applications", data);

export const getFellowshipApplications = (params = {}) =>
  api.get("/admin/fellowship-applications", { params });

export const updateFellowshipApplication = (id, data) =>
  api.patch(`/admin/fellowship-applications/${id}`, data);

export const screenFellowshipApplications = (data = {}) =>
  api.post("/admin/fellowship-applications/screen", data);

export const sendFellowshipInvite = (id, data) =>
  api.post(`/admin/fellowship-applications/${id}/invite`, data);

export const sendBulkFellowshipInvites = (data) =>
  api.post("/admin/fellowship-applications/invite-bulk", data);

export const sendFellowshipRegret = (id, data) =>
  api.post(`/admin/fellowship-applications/${id}/regret`, data);

export const sendBulkFellowshipRegrets = (data) =>
  api.post("/admin/fellowship-applications/regret-bulk", data);

export const uploadFellowshipInviteImage = (file) => {
  const formData = new FormData();
  formData.append("inviteImage", file);

  return api.post("/admin/fellowship-applications/invite-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteFellowshipApplication = (id) =>
  api.delete(`/admin/fellowship-applications/${id}`);
