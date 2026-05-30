const { Op } = require("sequelize");
const { Campaign } = require("../models/Relationship");
const fs = require("fs");
const path = require("path");

// For Admin/SuperAdmin
const newCampaign = async (req, res) => {
    try {
        const { category, subCategory, title, description, goal } = req.body;

        // Validation
        if (!category || !subCategory || !title || !description || !goal) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        if (isNaN(goal) || goal <= 0) {
            return res.status(400).json({ success: false, message: "Goal must be a valid number greater than 0" });
        }

        // Handle image upload
        // const imagePath = req.file ? req.file.path : null; // multer से image path मिलेगा

        // for cloudinary
        const imageUrl = req.file ? req.file.path : null;
        const imageId = req.file ? req.file.filename : null;

        // Create new campaign
        const campaign = await Campaign.create({ category, subCategory, title, description, goal, image: imageUrl, cloudinary_id: imageId });

        console.log("Saved:", campaign);
        res.status(201).json({ success: true, message: "Campaign created successfully", data: campaign });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Campaign creation failed", error: error.message });
    }
}

const updateCampaign = async (req, res) => {
    try {
        const updateData = req.body; //new data from user
        const campaign = req.campaign; // already available

        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: "Campaign not found"
            });
        }

        // Check if update data is valid
        const allowedFields = ["category", "subCategory", "title", "description", "goal"];
        const updates = Object.keys(updateData);
        const isValid = updates.every((field) => allowedFields.includes(field)); // returns true or false
        if (!isValid) {
            return res.status(400).json({ success: false, message: "Invalid update fields" });
        }

        // Check if goal is valid
        if (updateData.goal !== undefined && (isNaN(updateData.goal) || updateData.goal <= 0)) {
            return res.status(400).json({ success: false, message: "Goal must be > 0" });
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields provided for update",
            });
        }

        // Handle image upload
        // if (req.file) {

        //     // delete old image if image path  exists in db and file exists in server storage
        //     if (campaign.image && fs.existsSync(campaign.image)) {
        //         fs.unlinkSync(campaign.image);
        //     }
        //     // save new image path
        //     updateData.image = req.file.path; // multer से image path मिलेगा
        // }

        // Handle new image upload (Cloudinary)
        if (req.file) {

            // delete old image from cloudinary
            if (campaign.cloudinary_id) {
                await cloudinary.uploader.destroy(campaign.cloudinary_id);
            }

            // set new image
            updateData.image = req.file.path;
            updateData.cloudinary_id = req.file.filename; // or public_id depending config
        }

        // Update campaign to database
        const updatedCampaign = await campaign.update(updateData);

        return res.status(200).json({ success: true, message: "Campaign updated successfully", data: updatedCampaign });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update campaign", error: error.message, });
    }
}

const deleteCampaign = async (req, res) => {
    try {
        const campaign = req.campaign; // already available

        if (!campaign) {
            return res.status(404).json({ message: "Not found" });
        }

        // Delete image safely
        // if (campaign.image && fs.existsSync(campaign.image)) {
        //     fs.unlinkSync(campaign.image);
        // }

        //  Delete image from Cloudinary
        if (campaign.cloudinary_id) {
            await cloudinary.uploader.destroy(campaign.cloudinary_id);
        }

        await Campaign.destroy({ where: { id: campaign.id } });

        return res.status(200).json({ success: true, message: "Campaign deleted successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete campaign", error: error.message, });
    }
};

// For User

const allCampaigns = async (req, res) => {
    try {
        const { category, subCategory, page, limit } = req.query;

        // 🔍 Build dynamic filter
        const filter = {};

        if (category && category !== "null") {
            filter.category = category;
        }
        if (subCategory && subCategory !== "null") {
            filter.subCategory = subCategory;
        }

        // ✅ If NO pagination params → return ALL
        if (!page && !limit) {
            const campaigns = await Campaign.findAll({
                where: filter, // empty {} = no filter (returns all)
                order: [['createdAt', 'DESC']]
            });

            return res.status(200).json({
                success: true,
                data: campaigns
            });
        }

        // ✅ Else → pagination
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 6;

        const offset = (pageNum - 1) * limitNum;

        const { count, rows: campaigns } = await Campaign.findAndCountAll({
            where: filter,
            order: [['createdAt', 'DESC']],
            limit: limitNum,
            offset
        });

        return res.status(200).json({
            success: true,
            data: campaigns,
            totalItems: count,
            totalPages: Math.ceil(count / limitNum),
            currentPage: pageNum,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch campaigns",
            error: error.message
        });
    }
};

const singleCampaign = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid campaign id"
            });
        }

        const campaign = await Campaign.findByPk(id, {
            include: [Donation, User]
        });

        if (!campaign) {
            return res.status(404).json({ success: false, message: "Campaign not found" });
        }
        return res.status(200).json({ success: true, data: campaign });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch campaign", error: error.message });
    }
}


const searchCampaigns = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ success: false, message: "Search query is required" });
        }
        const campaigns = await Campaign.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.like]: `%${q}%` } },
                    { description: { [Op.like]: `%${q}%` } }
                ]
            }
        });
        return res.status(200).json({ success: true, data: campaigns });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to search campaigns", error: error.message });
    }
}

module.exports = { newCampaign, allCampaigns, singleCampaign, updateCampaign, deleteCampaign, searchCampaigns };

