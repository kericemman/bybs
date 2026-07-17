const express = require("express");
const protect = require("../../middleware/auth.middleware");
const { requireAdmin } = require("../../middleware/permission.middleware");
const {
  createManager,
  deleteManager,
  getManagers,
  updateManager,
} = require("../../controllers/adminManager.controllers");

const router = express.Router();

router.use(protect, requireAdmin);

router.get("/", getManagers);
router.post("/", createManager);
router.put("/:id", updateManager);
router.delete("/:id", deleteManager);

module.exports = router;
