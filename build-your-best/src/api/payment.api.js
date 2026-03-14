import api from "../utils/axios";

export const fetchPayments = () =>
  api.get("/admin/payments");

// export const fetchPaymentStats = () =>
//   api.get("/admin/payments/stats");

// export const syncPayments = () =>
//   api.post("/admin/payments/sync");
