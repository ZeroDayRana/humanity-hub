const express = require("express");
const upload = require("../middleware/multerMiddleware");
const {newCampaign, allCampaigns, singleCampaign, updateCampaign, deleteCampaign, searchCampaigns} = require("../controllers/campaignController");
const router = express.Router();
router.get("/", allCampaigns); // get all campaigns
router.post("/", upload.single("image"), newCampaign); // create campaign with image
router.get("/search", searchCampaigns); // search campaigns
router.get("/:id", singleCampaign); // get single campaign
router.patch("/:id", updateCampaign); // update campaign
router.delete("/:id", deleteCampaign); // delete campaign

module.exports = router