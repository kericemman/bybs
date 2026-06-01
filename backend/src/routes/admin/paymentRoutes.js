const express = require("express");
const protect = require("../../middleware/auth.middleware");
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
router.get("/orders", protect, getOrders);
router.get("/orders/:id", protect, getOrderById);
router.patch("/orders/:id/delivered", protect, markDelivered);
router.delete("/orders/:id", protect, deleteOrder);



module.exports = router;
