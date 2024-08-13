const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    TelegramId: {
        type: Number,
        required: true,
    },
    reportID: {
        type: Number,
        required: true,
        unique: true
    },
    reportTitle: {
        type: String,
        required: false
    },
    reportDescription: {
        type: String,
        required: false
    },
    reportLocation: {
        type: String,
        required: false
    },
    reportAttachments: {
        type: Array,
        required: false
    },
    reportLocalPath: {
        type: Array,
        required: false
    },
    reportExtraLinks: {
        type: Array,
        required: false
    },
    reportStatus: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        required: false
    },
    isAccepted: {
        type: Boolean,
        default: false
    },
    reportDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Report', reportSchema);
