const express = require("express");
const protect = require("../../middleware/auth.middleware");
const { requireAdmin } = require("../../middleware/permission.middleware");
const {
  createOrder,
  createCartOrder,
  handleWebhook,
  verifyPayment,
  getOrders,
  markDelivered,
  deleteOrder,
  getOrderById,

} = require("../../controllers/paymentControllers");

const router = express.Router();

// Public
router.post("/orders", createOrder);
router.post("/cart-order", createCartOrder);
router.get("/verify/:reference", verifyPayment);
router.post("/webhook", handleWebhook);

// Admin
router.get("/orders", protect, requireAdmin, getOrders);
router.get("/orders/:id", protect, requireAdmin, getOrderById);
router.patch("/orders/:id/delivered", protect, requireAdmin, markDelivered);
router.delete("/orders/:id", protect, requireAdmin, deleteOrder);



module.exports = router;
