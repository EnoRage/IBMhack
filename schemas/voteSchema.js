const mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;
var Schema = mongoose.Schema;
var vote = new Schema({
    voteID: {
        type: Number
    },
    organisationID: {
        type: Number
    },
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