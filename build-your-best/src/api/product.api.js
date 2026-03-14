import api from "../utils/axios";

export const getAdminProducts = () =>
  api.get("/products/admin/all");

export const createProduct = (data) =>
  api.post("/products/admin", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateProduct = (id, data) =>
  api.put(`/products/admin/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteProduct = (id) =>
  api.delete(`/products/admin/${id}`);
