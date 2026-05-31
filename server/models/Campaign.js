const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Campaign = sequelize.define('Campaign', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  subCategory: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
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
  cloudinary_id:{
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
}, {
  timestamps: true,
  tableName: 'campaigns', // Tells Linux/Aiven exactly what lowercase table to find
  freezeTableName: true   // Stops Sequelize from guessing or altering the name
});

module.exports = Campaign;