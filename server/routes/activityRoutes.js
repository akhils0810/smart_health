const express = require('express');
const router = express.Router();
const { getActivities, setActivity } = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getActivities).post(protect, setActivity);

module.exports = router;
