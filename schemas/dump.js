const mongoose = require('mongoose');

const dumpSchema = new mongoose.Schema({
    CollectionName: {
        type: String,
        required: true,
    },
    DumpedData: {
        type: Object,
        required: true,
    },
    DumpDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Dump', dumpSchema);