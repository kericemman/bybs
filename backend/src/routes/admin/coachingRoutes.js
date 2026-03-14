const express = require("express");
const {
  initiateCoaching,
  verifyCoaching,
} = require("../../controllers/coachingControllers");

const router = express.Router();

// ✅ Make sure these names match your exported functions
router.post("/initiate", initiateCoaching);
router.post("/verify", verifyCoaching);

module.exports = router;
