const express = require("express");
const { renderPublicSeoPage } = require("../../controllers/seoPage.controller");

const router = express.Router();

router.get("/", renderPublicSeoPage);

module.exports = router;
