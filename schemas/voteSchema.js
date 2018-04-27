const mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;
var Schema = mongoose.Schema;
var vote = new Schema({
    description: {
        type: String
    },
    startTime: {
        type: Number,
        default: Date.now()
    },
    endTime: {
        type: Number
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('vote', vote);