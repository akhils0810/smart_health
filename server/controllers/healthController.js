const asyncHandler = require('express-async-handler');
const HealthMetric = require('../models/HealthMetric');

// @desc    Get health metrics
// @route   GET /api/health-metrics
// @access  Private
const getHealthMetrics = asyncHandler(async (req, res) => {
    const metrics = await HealthMetric.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(metrics);
});

// @desc    Set health metric
// @route   POST /api/health-metrics
// @access  Private
const setHealthMetric = asyncHandler(async (req, res) => {
    const { weight, height, bloodPressure, heartRate } = req.body;

    if (!weight || !height) {
        res.status(400);
        throw new Error('Please add weight and height');
    }

    // BMI Calculation: weight (kg) / [height (m)]^2
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);

    const metric = await HealthMetric.create({
        user: req.user.id,
        weight,
        height,
        bmi,
        bloodPressure,
        heartRate,
        date: new Date()
    });

    res.status(200).json(metric);
});

module.exports = {
    getHealthMetrics,
    setHealthMetric,
};
