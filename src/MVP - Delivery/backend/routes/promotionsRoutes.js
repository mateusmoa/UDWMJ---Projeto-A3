const express = require('express');
const router = express.Router();
const controller = require('../controllers/promotionController');
const auth = require('../middleware/auth');

router.post('/', auth, controller.create);
router.get('/', controller.getActive);
router.delete('/:id', auth, controller.delete);

module.exports = router;
