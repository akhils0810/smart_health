const asyncHandler = require('express-async-handler');
const Diet = require('../models/Diet');

// @desc    Get diets
// @route   GET /api/diets
// @access  Private
const getDiets = asyncHandler(async (req, res) => {
    const diets = await Diet.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(diets);
});

// @desc    Set diet
// @route   POST /api/diets
// @access  Private
const setDiet = asyncHandler(async (req, res) => {
    if (!req.body.mealType || !req.body.foodItems || !req.body.calories) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const diet = await Diet.create({
        user: req.user.id,
        mealType: req.body.mealType,
        foodItems: req.body.foodItems,
        calories: req.body.calories,
        date: new Date()
    });

    res.status(200).json(diet);
});

module.exports = {
    getDiets,
    setDiet,
};
