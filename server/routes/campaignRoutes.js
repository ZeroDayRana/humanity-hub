const express = require("express");
const {allCampaigns, singleCampaign, searchCampaigns} = require("../controllers/campaignController");
const router = express.Router();
router.get("/", allCampaigns); // get all campaigns
router.get("/search", searchCampaigns); // search campaigns
router.get("/:id", singleCampaign); // get single campaign


module.exports = router