const express = require("express");
const {
  getFeaturedCommunityAction,
  getPublishedCommunityAction,
  getPublishedCommunityActions,
} = require("../../controllers/communityAction.controllers");

const router = express.Router();

router.get("/", getPublishedCommunityActions);
router.get("/featured", getFeaturedCommunityAction);
router.get("/:slug", getPublishedCommunityAction);

module.exports = router;
