const User = require('./User');
const Campaign = require('./Campaign');
const Donation = require('./Donation');

// Relationships

// User → Campaign
User.hasMany(Campaign, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

Campaign.belongsTo(User, {
    foreignKey: "userId"
});


// User → Donation
User.hasMany(Donation, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

Donation.belongsTo(User, {
    foreignKey: "userId"
});


// Campaign → Donation
Campaign.hasMany(Donation, {
    foreignKey: "campaignId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

Donation.belongsTo(Campaign, {
    foreignKey: "campaignId"
});

module.exports = {
    User,
    Campaign,
    Donation
}; 