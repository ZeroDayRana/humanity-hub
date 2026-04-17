const { Op } = require("sequelize");
const { Campaign } = require("../models/Relationship");

const newCampaign = async (req, res) => {
    try {
        const { title, description, goal, image } = req.body;

        // Validation
        if (!title || !description || !goal) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        if (isNaN(goal) || goal <= 0) {
            return res.status(400).json({ success: false, message: "Goal must be a valid number greater than 0" });
        }

        // Handle image upload
        const imagePath = req.file ? req.file.path : null; // multer से image path मिलेगा

        // Create new campaign
        const campaign = await Campaign.create({ title, description, goal, image: imagePath });
        console.log("Saved:", campaign);
        res.status(201).json({ success: true, message: "Campaign created successfully", data: campaign });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Campaign creation failed", error: error.message });
    }
}

const allCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.findAll({ order: [['createdAt', 'DESC']] });
        return res.status(200).json({ success: true, data: campaigns });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch campaigns", error: error.message });
    }
}

const singleCampaign = async (req, res) => {
    try {
        const { id } = req.params;

        const campaign = await Campaign.findByPk(id);

        if (!campaign) {
            return res.status(404).json({ success: false, message: "Campaign not found"});
        }
        return res.status(200).json({ success: true, data: campaign });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch campaign", error: error.message });
    }
}

const updateCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body; //new data from user

        // 1. Check if campaign exists
        const campaign = await Campaign.findByPk(id);
        if (!campaign) {
            return res.status(404).json({ success: false, message: "Campaign not found" });
        }

        // 2. Check if update data is valid
        const allowedFields = ["title", "description", "goal", "image"];
        const updates = Object.keys(updateData);
        const isValid = updates.every((field) => allowedFields.includes(field)); // returns true or false
        if (!isValid) {
            return res.status(400).json({ success: false, message: "Invalid update fields" });
        }

        // 3. Check if goal is valid
        if (updateData.goal !== undefined && (isNaN(updateData.goal) || updateData.goal <= 0)) {
            return res.status(400).json({ success: false, message: "Goal must be > 0" });
        }

        // 4. Update campaign to database
        await campaign.update(updateData);

        return res.status(200).json({ success: true, message: "Campaign updated successfully", data: campaign });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update campaign", error: error.message, });
    }
}

const deleteCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Campaign.destroy({ where: { id } });

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Campaign not found" });
        }
        return res.status(200).json({ success: true, message: "Campaign deleted successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete campaign", error: error.message, });
    }
};


const searchCampaigns = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ success: false, message: "Search query is required" });
        }
        const campaigns = await Campaign.findAll({
            where: {
                [Op.or]: [
                    {title: { [Op.like]: `%${q}%` }},
                    {description: { [Op.like]: `%${q}%` }}
                ]
            }
        });
        return res.status(200).json({ success: true, data: campaigns });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to search campaigns", error: error.message });
    }
}

module.exports = { newCampaign, allCampaigns, singleCampaign, updateCampaign, deleteCampaign, searchCampaigns };

