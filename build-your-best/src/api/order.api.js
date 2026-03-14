import api from "../utils/axios";

export const getOrders = () =>
  api.get("/payments/orders");

export const markDelivered = (id) =>
  api.patch(`/payments/orders/${id}/delivered`);

export const downloadInvoice = (id) =>
  api.get(`/payments/orders/${id}/invoice`, {
    responseType: "blob",
  });

  export const deleteOrder = (id) =>
    api.delete(`/payments/orders/${id}`);
  

  export const getOrderDetails = (id) =>
    api.get(`/payments/orders/${id}`);
  