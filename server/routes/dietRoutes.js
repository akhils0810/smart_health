const express = require('express');
const router = express.Router();
const { getDiets, setDiet } = require('../controllers/dietController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getDiets).post(protect, setDiet);

module.exports = router;
