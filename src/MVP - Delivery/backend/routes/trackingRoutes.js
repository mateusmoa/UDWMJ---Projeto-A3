const express = require('express');
const router = express.Router();
const controller = require('../controllers/trackingController');
const auth = require('../middleware/auth');

router.get('/', auth, controller.getCurrentOrderStatus);

module.exports = router;
