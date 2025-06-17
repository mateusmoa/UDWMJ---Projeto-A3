const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');

router.post('/', auth, cartController.addToCart);
router.get('/', auth, cartController.getCart);
router.delete('/:id', auth, cartController.removeItem);
router.delete('/', auth, cartController.clearCart);

module.exports = router;
