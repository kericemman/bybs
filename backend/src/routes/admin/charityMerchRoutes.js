const express = require("express");
const protect = require("../../middleware/auth.middleware");

const {
  createCharityMerchOrder,
  getCharityMerchOrders,
  updateCharityMerchOrderStatus,
  deleteCharityMerchOrder,
} = require("../../controllers/charityController");

const router = express.Router();

router.post("/", createCharityMerchOrder);

router.get("/admin", protect, getCharityMerchOrders);
router.patch("/admin/:id/status", protect, updateCharityMerchOrderStatus);
router.delete("/admin/:id", protect, deleteCharityMerchOrder);

module.exports = router;