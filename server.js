//server.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const { Category, Brand, ClothingItem } = require('./models/associations');
const clothingRoutes = require('./routes/clothingRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', clothingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Database connection and server start
const PORT = process.env.PORT || 3001;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Database connection established');

        await sequelize.sync({ alter: true });
        console.log('Database synchronized');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
        process.exit(1);
    }
}

startServer();