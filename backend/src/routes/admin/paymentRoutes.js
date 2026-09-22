const express = require("express");
const protect = require("../../middleware/auth.middleware");
const { requireAdmin } = require("../../middleware/permission.middleware");
const {
  createCartOrder,
  getOrders,
  markDelivered,
  deleteOrder,
  getOrderById,
} = require("../../controllers/paymentControllers");

const router = express.Router();

// Public order requests. Payment is arranged directly with the BYBS team.
router.post("/request", createCartOrder);

// Admin
router.get("/orders", protect, requireAdmin, getOrders);
router.get("/orders/:id", protect, requireAdmin, getOrderById);
router.patch("/orders/:id/delivered", protect, requireAdmin, markDelivered);
router.delete("/orders/:id", protect, requireAdmin, deleteOrder);

module.exports = router;
