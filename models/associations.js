// models/associations.js
const Category = require('./Category');
const Brand = require('./Brand');
const ClothingItem = require('./ClothingItem');

// Category has many ClothingItems
Category.hasMany(ClothingItem);
ClothingItem.belongsTo(Category);

// Brand has many ClothingItems
Brand.hasMany(ClothingItem);
ClothingItem.belongsTo(Brand);

module.exports = { Category, Brand, ClothingItem };