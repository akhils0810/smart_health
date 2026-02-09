const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Activity = require('../models/Activity');
const Diet = require('../models/Diet');
const bcrypt = require('bcryptjs');

// @desc    Seed database with mock data
// @route   POST /api/seed
// @access  Public
const seedData = asyncHandler(async (req, res) => {
    // Clear existing data
    await User.deleteMany({});
    await Activity.deleteMany({});
    await Diet.deleteMany({});

    // Create Demo User
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash('123456', salt);

    const user = await User.create({
        name: 'Demo User',
        email: 'demo@example.com',
        password: '123456', // Pass plain text, pre-save hook will hash it
        age: 28,
        gender: 'Male',
        height: 175,
        weight: 70
    });

    // We shouldn't have hashed it manually if we use .create with the raw password, 
    // BUT the pre-save hook might hash it again if we satisfy isModified.
    // Actually, let's look at lines 45-51 of User.js:
    // It hashes `this.password`. 
    // So I should pass the PLAINTEXT password '123456' to .create().
    // However, I already defined `hashedPassword`. I will just pass '123456' to avoid confusion.

    // Correction: I'll use a new User instance to be 100% sure or just rely on .create. 
    // Let's stick to the standard way: pass raw password to .create().

    // Wait, I need the user ID for relationships.
    const userId = user._id;

    // Generate last 7 days dates
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d);
    }

    const activities = [];
    const diets = [];

    // Mock Activities
    const activityTypes = ['Running', 'Cycling', 'Gym', 'Swimming', 'Yoga'];

    dates.forEach(date => {
        // Add 1-2 activities per day
        const numActivities = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < numActivities; i++) {
            const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
            const duration = Math.floor(Math.random() * 60) + 20; // 20-80 mins
            const calories = Math.floor(duration * (Math.random() * 5 + 5)); // 5-10 cal/min

            activities.push({
                user: userId,
                activityType: type,
                duration,
                caloriesBurned: calories,
                date: date
            });
        }
    });

    // Mock Diets
    const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
    const foods = {
        'Breakfast': ['Oatmeal', 'Eggs & Toast', 'Smoothie', 'Pancakes'],
        'Lunch': ['Chicken Salad', 'Sandwich', 'Rice & Curry', 'Pasta'],
        'Dinner': ['Grilled Salmon', 'Steak', 'Soup', 'Tacos'],
        'Snack': ['Apple', 'Nuts', 'Yogurt', 'Protein Bar']
    };

    dates.forEach(date => {
        mealTypes.forEach(meal => {
            // 80% chance to log a meal
            if (Math.random() > 0.2) {
                const foodItem = foods[meal][Math.floor(Math.random() * foods[meal].length)];
                const cal = meal === 'Snack' ? Math.floor(Math.random() * 200) + 100 : Math.floor(Math.random() * 400) + 300;

                diets.push({
                    user: userId,
                    mealType: meal,
                    foodItems: foodItem,
                    calories: cal,
                    date: date
                });
            }
        });
    });

    await Activity.insertMany(activities);
    await Diet.insertMany(diets);

    res.status(201).json({
        message: 'Database seeded successfully',
        user: {
            email: 'demo@example.com',
            password: '123456'
        }
    });
});

module.exports = { seedData };
