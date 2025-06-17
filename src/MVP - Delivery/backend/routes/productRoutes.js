const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/productController');

// 📥 Criação (autenticado)
router.post('/', auth, controller.createProduct);

// 🔍 Busca geral e especializadas
router.get('/search', controller.searchProducts);
router.get('/on-sale', controller.getProductsOnSale);
router.get('/restaurant/me', auth, controller.getProductsByRestaurant);

// 🧾 Leitura
router.get('/', controller.getAll);
router.get('/:id', controller.getById);

// ✏️ Atualização e remoção (autenticado)
router.put('/:id', auth, controller.updateProduct);
router.delete('/:id', auth, controller.deleteProduct);

module.exports = router;
