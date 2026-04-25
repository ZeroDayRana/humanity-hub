const { Campaign } = require("../models/Relationship");

const canModifyCampaignMiddleware = async (req, res, next) => {
    try {
        const { id } = req.params;

        const campaign = await Campaign.findByPk(id);

        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: "Campaign not found",
            });
        }

        const isOwner = campaign.userId === req.user.id;
        const isAdmin =
            req.user.role === "admin" ||
            req.user.role === "superadmin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Not allowed to access this campaign",
            });
        }

        // ✅ attach campaign to request (VERY useful)
        req.campaign = campaign;

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Authorization check for campaign failed",
            error: error.message,
        });
    }
};

module.exports = canModifyCampaignMiddleware;