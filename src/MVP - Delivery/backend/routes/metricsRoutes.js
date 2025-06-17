const express = require('express');
const router = express.Router();
const controller = require('../controllers/metricsController');

router.get('/:id', controller.getWeeklyMetrics);

module.exports = router;
