const express = require("express");
const { createDonation, paymentStatus } = require("../controllers/donationController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/", authMiddleware, createDonation); // make a donation
router.get("/payment-status/:orderId", paymentStatus); // get donation details

module.exports = router