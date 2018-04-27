const mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;
var Schema = mongoose.Schema;
var voter = new Schema({
    voteID: {
        type: Number,
        default: 0
    },
    userID: {
        type: String
    },
    vote: {
        type: Number,
        default: 0
    },
    date: {
        type: Number,
        default: Date.now()
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('voter', voter);