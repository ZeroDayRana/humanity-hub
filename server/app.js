const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const donationRoutes = require("./routes/donationRoutes");
const sequelize = require("./config/db");

const port = 3000;
const app = express();

// origin used for vercel deployment
app.use(
  cors({
    origin: "https://humanity-hub-charity.vercel.app",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Make uploads folder publicly accessible
app.use("/uploads", express.static("uploads"));

app.use("/api/user", userRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/admin", require("./routes/adminRoutes")); // Admin routes

sequelize.sync().then(() => {
    console.log("✅ Database synced");
    app.listen(port, () => console.log(`Server running on port ${port}`));
})
.catch((err) => {
    console.error("Error syncing database:", err);
});

