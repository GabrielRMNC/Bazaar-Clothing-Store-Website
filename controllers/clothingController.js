// controllers/clothingController.js
const { ClothingItem, Category, Brand } = require('../models/associations');
const { Op } = require('sequelize');

exports.getClothes = async (req, res) => {
    try {
        const { page = 1, limit = 8, category, brand, sort } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if (category) {
            where['$Category.name$'] = { [Op.like]: `%${category}%` };
        }
        if (brand) {
            where['$Brand.name$'] = { [Op.like]: `%${brand}%` };
        }

        const order = [];
        if (sort === 'price') {
            order.push(['price', 'ASC']);
        } else {
            order.push(['name', 'ASC']);
        }

        const { rows: items, count } = await ClothingItem.findAndCountAll({
            include: [
                { model: Category },
                { model: Brand }
            ],
            where,
            order,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            items,
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createClothing = async (req, res) => {
    try {
        const { name, price, description, image, category, brand } = req.body;

        const [categoryInstance] = await Category.findOrCreate({
            where: { name: category }
        });

        const [brandInstance] = await Brand.findOrCreate({
            where: { name: brand }
        });

        const clothing = await ClothingItem.create({
            name,
            price,
            description,
            image,
            CategoryId: categoryInstance.id,
            BrandId: brandInstance.id
        });

        res.status(201).json(clothing);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};

// Read One
exports.getClothingById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await ClothingItem.findByPk(id, {
            include: [Category, Brand]
        });

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update
exports.updateClothing = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, image, category, brand } = req.body;

        const item = await ClothingItem.findByPk(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        const [categoryInstance] = await Category.findOrCreate({
            where: { name: category }
        });

        const [brandInstance] = await Brand.findOrCreate({
            where: { name: brand }
        });

        await item.update({
            name,
            price,
            description,
            image,
            CategoryId: categoryInstance.id,
            BrandId: brandInstance.id
        });

        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete
exports.deleteClothing = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await ClothingItem.findByPk(id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        await item.destroy();
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};