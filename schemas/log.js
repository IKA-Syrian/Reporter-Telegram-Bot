const mongoose = require('mongoose');

const logsSchema = new mongoose.Schema({
    userID: {
        type: Object,
        required: true,
    },
    ActionType: {
        type: String,
        enum: ['INSERT', 'UPDATE REPORT', 'UPDATE REPORTER', "DELETE REPORT", 'DELETE REPORTER', "DOWNLOAD MEDIA"],
        required: false
    },
    logData: {
        type: Object,
        required: false
    },
    logDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Logs', logsSchema);