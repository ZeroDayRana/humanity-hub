const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Donation = sequelize.define('Donation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  donorName: {
    type: DataTypes.STRING,
    allowNull: false
  },

  donorEmail: {
    type: DataTypes.STRING
  },
  phoneNumber: {
    type: DataTypes.STRING,
  },
  paymentSessionId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Payment related fields
  orderId: {
    type: DataTypes.STRING,
    unique: true
  },

  paymentId: {
    type: DataTypes.STRING
  },

  paymentStatus: {
    type: DataTypes.STRING,
    defaultValue: 'pending' // pending, success, failed
  },
}, {
  timestamps: true // adds createdAt & updatedAt
});

module.exports = Donation;