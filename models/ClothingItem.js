// models/ClothingItem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ClothingItem = sequelize.define('ClothingItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = ClothingItem;