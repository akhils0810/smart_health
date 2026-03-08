const express = require('express');
const router = express.Router();
const { getHealthMetrics, setHealthMetric } = require('../controllers/healthController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getHealthMetrics).post(protect, setHealthMetric);

module.exports = router;
