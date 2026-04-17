const { Donation, Campaign } = require('../models/Relationship');
const sequelize = require('../config/db');
const { generateSession, verifyPayment } = require('../services/cashfreeService');
const createDonation = async (req, res) => {

    //dummy data for testing
    // const { id, name, email, phoneNumber } = {
    //     id: "1",
    //     name: "John Doe",
    //     email: "test@gmail.com",
    // phoneNumber: "1234567890"
    // };
    // const {  amount } = req.body

    try {
        // ✅ Trusted user data (from auth middleware)
        const { id, name, email } = req.user;

        // ✅ User input
        const { amount, campaignId } = req.body;

        const phoneNumber = "1234567890";

        // ✅ Validation
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        if (!campaignId) {
            return res.status(400).json({ message: "Campaign ID required" });
        }

        // ✅ Check campaign exists & is active
        const campaign = await Campaign.findByPk(campaignId);
        if (!campaign || !campaign.isActive) {
            return res.status(400).json({ message: "Invalid or inactive campaign" });
        }

        // ✅ Create unique order
        const orderData = {
            orderId: "order_" + Date.now() + "_" + id,
            orderAmount: amount,
            orderCurrency: "INR",
            customerId: `user_${id}`, // id should be string
            customerName: name,
            customerEmail: email,
            customerPhone: phoneNumber
        };

        console.log("Creating order with data:", orderData);
        // ✅ Create payment session (Cashfree)
        const sessionId = await generateSession(orderData);

        // ✅ Save donation as PENDING
        await Donation.create({
            userId: id,
            amount: amount,
            donorName: name,
            donorEmail: email,
            phoneNumber: phoneNumber,
            orderId: orderData.orderId,
            paymentSessionId: sessionId,
            paymentStatus: "pending",
            campaignId: campaignId, // 🔥 LINK TO CAMPAIGN
        });

        // ✅ Send sessionId to frontend
        return res.status(200).json({ sessionId: sessionId });

    } catch (error) {
        console.log("🔥 ERROR:", error);
        return res.status(500).json({
            message: 'Failed to create payment session',
            error: error.message
        });
    }
}

const paymentStatus = async (req, res) => {
    const t = await sequelize.transaction(); // 🔥 IMPORTANT

    try {
        const { orderId } = req.params;

        // ✅ Verify payment from Cashfree
        const paymentInfo = await verifyPayment(orderId);

        // ✅ Find donation
        const donation = await Donation.findOne({
            where: { orderId },
            transaction: t
        });

        if (!donation) {
            await t.rollback();
            return res.status(404).json({ message: "Order not found" });
        }

        // ⚠️ Prevent duplicate processing
        if (donation.paymentStatus === "success") {
            await t.rollback();
            return res.status(200).json({ message: "Already processed" });
        }

        // ✅ SUCCESS CASE
        if (paymentInfo.order_status === "PAID") {

            // 🔥 Get campaign
            const campaign = await Campaign.findByPk(donation.campaignId, {
                transaction: t
            });

            if (!campaign) {
                await t.rollback();
                return res.status(404).json({ message: "Campaign not found" });
            }

            // ✅ Update donation status
            await donation.update({
                paymentStatus: "success",
                paymentId: paymentInfo.cf_order_id
            }, { transaction: t });

            // ✅ Update campaign amount
            campaign.raised += donation.amount;

            // ✅ Check goal reached
            if (campaign.raised >= campaign.goal) {
                campaign.isActive = false;
            }

            await campaign.save({ transaction: t });

            await t.commit();

            return res.status(200).json({
                message: "Payment successful & campaign updated"
            });
        }

        // ❌ FAILED CASE
        else if (paymentInfo.order_status === "FAILED") {

            await donation.update({
                paymentStatus: "failed"
            }, { transaction: t });

            await t.commit();

            return res.status(400).json({ message: "Payment failed" });
        }

        // ⏳ PENDING
        else {
            await t.rollback();
            return res.status(200).json({ message: "Payment pending" });
        }

    } catch (err) {
        await t.rollback();
        return res.status(500).json({
            message: "Payment verification failed",
            error: err.message
        });
    }
};
module.exports = { createDonation, paymentStatus }

