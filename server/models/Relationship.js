const User = require('./User');
const Campaign = require('./Campaign');
const Donation = require('./Donation');

// Relationships

// User creates campaigns
User.hasMany(Campaign, { foreignKey: "userId" });
Campaign.belongsTo(User, { foreignKey: "userId" });

// Campaign receives donations
Campaign.hasMany(Donation, { foreignKey: "campaignId" });
Donation.belongsTo(Campaign, { foreignKey: "campaignId" });

// User makes donations
User.hasMany(Donation, { foreignKey: "userId" });
Donation.belongsTo(User, { foreignKey: "userId" });

module.exports = {
    User,
    Campaign,  
    Donation
}; 