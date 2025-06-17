const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

router.get('/dashboard', dashboardController.getRestaurantDashboard);
router.get('/orders', auth, dashboardController.getOrders);
router.put('/orders/status', auth, dashboardController.updateStatus);
router.get('/reviews', auth, dashboardController.getReviews);

module.exports = router;
