const asyncHandler = require('express-async-handler');
const Activity = require('../models/Activity');

// @desc    Get activities
// @route   GET /api/activities
// @access  Private
const getActivities = asyncHandler(async (req, res) => {
    const activities = await Activity.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(activities);
});

// @desc    Set activity
// @route   POST /api/activities
// @access  Private
const setActivity = asyncHandler(async (req, res) => {
    if (!req.body.activityType || !req.body.duration || !req.body.caloriesBurned) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const activity = await Activity.create({
        user: req.user.id,
        activityType: req.body.activityType,
        duration: req.body.duration,
        caloriesBurned: req.body.caloriesBurned,
        date: new Date()
    });

    res.status(200).json(activity);
});

module.exports = {
    getActivities,
    setActivity,
};
