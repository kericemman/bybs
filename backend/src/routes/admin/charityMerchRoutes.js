const express = require("express");
const protect = require("../../middleware/auth.middleware");
const { requireAdmin } = require("../../middleware/permission.middleware");

const {
  createCharityMerchOrder,
  getCharityMerchOrders,
  updateCharityMerchOrderStatus,
  deleteCharityMerchOrder,
} = require("../../controllers/charityController");

const router = express.Router();

router.post("/", createCharityMerchOrder);

router.get("/admin", protect, requireAdmin, getCharityMerchOrders);
router.patch("/admin/:id/status", protect, requireAdmin, updateCharityMerchOrderStatus);
router.delete("/admin/:id", protect, requireAdmin, deleteCharityMerchOrder);

module.exports = router;
