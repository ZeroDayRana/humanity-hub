const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Define the User model
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    resetToken: {
        type: DataTypes.STRING,
    },
    resetTokenExpiry: {
        type: DataTypes.DATE,
    }
}, {
    timestamps: true
});

module.exports = User;