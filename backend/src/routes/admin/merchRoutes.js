const express = require("express");
const { initiateMerchPayment, verifyMerchPayment } = require("../../controllers/merchControllers");

const router = express.Router();

router.post("/initiate", initiateMerchPayment);
router.post("/verify", verifyMerchPayment);

module.exports = router;
