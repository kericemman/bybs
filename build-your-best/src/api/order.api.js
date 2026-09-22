import api from "../utils/axios";

export const getOrders = () => api.get("/order-requests/orders");

export const markDelivered = (id) => api.patch(`/order-requests/orders/${id}/delivered`);

export const deleteOrder = (id) => api.delete(`/order-requests/orders/${id}`);

export const getOrderDetails = (id) => api.get(`/order-requests/orders/${id}`);
