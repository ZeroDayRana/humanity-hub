const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Campaign = sequelize.define('Campaign', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 255]
    }
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      notEmpty: true
    }
  },

  goal: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: true,
      min: 1
    }
  },

  raised: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: {
      isFloat: true,
      min: 0
    }
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
}, {
  timestamps: true
});

module.exports = Campaign;