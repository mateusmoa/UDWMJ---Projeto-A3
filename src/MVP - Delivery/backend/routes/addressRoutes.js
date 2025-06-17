const express = require('express');
const router = express.Router();
const controller = require('../controllers/addressController');

// Buscar endereços por usuário
router.get('/user/:id', controller.getUserAddresses);

// Criar novo endereço
router.post('/', controller.createAddress);

// Atualizar endereço
router.put('/:id', controller.updateAddress);

// Excluir endereço
router.delete('/:id', controller.deleteAddress);

module.exports = router;
