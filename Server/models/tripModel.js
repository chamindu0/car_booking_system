const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    passenger: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true
    },
    pickupLocation: {
        type: String,
        required: true
    },
    dropoffLocation: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    fare: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Trip', tripSchema);
