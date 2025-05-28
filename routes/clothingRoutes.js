// routes/clothingRoutes.js
const express = require('express');
const router = express.Router();
const clothingController = require('../controllers/clothingController');

router.post('/clothes', clothingController.createClothing);
router.get('/clothes', clothingController.getClothes);
router.get('/clothes/:id', clothingController.getClothingById);
router.put('/clothes/:id', clothingController.updateClothing);
router.delete('/clothes/:id', clothingController.deleteClothing);

module.exports = router;