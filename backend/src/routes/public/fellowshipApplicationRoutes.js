const express = require("express");
const {
  createFellowshipApplication,
} = require("../../controllers/fellowshipApplication.controllers");

const router = express.Router();

router.post("/", createFellowshipApplication);

module.exports = router;
