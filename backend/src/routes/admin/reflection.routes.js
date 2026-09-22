const express = require("express");
const protect = require("../../middleware/auth.middleware");
const { requireAdmin } = require("../../middleware/permission.middleware");
const upload = require("../../utils/clodinaryUpload");
const {
  createPrompt,
  deletePrompt,
  getAdminPrompts,
  getAdminSubmissions,
  updatePrompt,
  updateSubmission,
} = require("../../controllers/reflection.controllers");

const router = express.Router();

router.use(protect, requireAdmin);
router.get("/prompts", getAdminPrompts);
router.post("/prompts", upload.single("featuredImage"), createPrompt);
router.put("/prompts/:id", upload.single("featuredImage"), updatePrompt);
router.delete("/prompts/:id", deletePrompt);
router.get("/submissions", getAdminSubmissions);
router.patch("/submissions/:id", updateSubmission);

module.exports = router;
