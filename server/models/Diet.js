const mongoose = require('mongoose');

const dietSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    mealType: {
        type: String,
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
        required: true
    },
    foodItems: {
        type: String,
        required: true
    },
    calories: {
        type: Number,
        required: true
    },
    protein: {
        type: Number, // in grams
        default: 0
    },
    carbs: {
        type: Number, // in grams
        default: 0
    },
    fats: {
        type: Number, // in grams
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Diet = mongoose.model('Diet', dietSchema);

module.exports = Diet;
