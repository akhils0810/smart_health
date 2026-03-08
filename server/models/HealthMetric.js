const mongoose = require('mongoose');

const healthMetricSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    weight: {
        type: Number, // in kg
        required: true
    },
    height: {
        type: Number, // in cm
        required: true
    },
    bmi: {
        type: Number,
        required: true
    },
    bloodPressure: {
        systolic: Number,
        diastolic: Number
    },
    heartRate: {
        type: Number // bpm
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const HealthMetric = mongoose.model('HealthMetric', healthMetricSchema);

module.exports = HealthMetric;
