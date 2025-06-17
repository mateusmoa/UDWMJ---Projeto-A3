const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

// Rota para login de restaurante
router.post('/login', restaurantController.loginRestaurant);

// Rota para criação (registro) de restaurante
router.post('/register', restaurantController.createRestaurant);

// Rota para busca inteligente – deve vir antes de ":id"
router.get('/search', restaurantController.searchRestaurants);

// Rota para listar todos os restaurantes
router.get('/', restaurantController.getAllRestaurants);

// Rota para buscar restaurante pelo ID
router.get('/:id', restaurantController.getRestaurantById);

module.exports = router;
