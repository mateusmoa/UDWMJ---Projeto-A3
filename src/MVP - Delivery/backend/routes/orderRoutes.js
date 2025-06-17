const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const orderController = require('../controllers/orderController');

// Criação de pedido (autenticado)
router.post('/', auth, orderController.createOrder);

// Retornar o status de um pedido específico
router.get('/:id/status', auth, orderController.getOrderStatus);

// Buscar todos os pedidos do usuário (autenticado)
router.get('/', auth, orderController.getOrdersByUser);

module.exports = router;
