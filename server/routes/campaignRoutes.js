const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const canModifyCampaignMiddleware = require("../middleware/canModifyCampaignMiddleware");
const {newCampaign, updateCampaign, deleteCampaign, allCampaigns, singleCampaign, searchCampaigns} = require("../controllers/campaignController");
const router = express.Router();
router.post("/", authMiddleware, newCampaign); // create new campaign
router.patch("/:id", authMiddleware, canModifyCampaignMiddleware, updateCampaign); // update campaign
router.delete("/:id", authMiddleware, canModifyCampaignMiddleware, deleteCampaign); // delete campaign
router.get("/", allCampaigns); // get all campaigns
router.get("/search", searchCampaigns); // search campaigns
router.get("/:id", authMiddleware, singleCampaign); // get single campaign


module.exports = router