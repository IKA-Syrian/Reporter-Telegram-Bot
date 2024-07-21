const mongoose = require('mongoose');

const reporterSchema = new mongoose.Schema({
    TelegramId: {
        type: Number,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: Number,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    correct: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    Verified: {
        type: Boolean,
        default: false
    },
    invalidAttempts: {
        type: Number,
        default: 0
    },
    isBlocked: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Reporter', reporterSchema);