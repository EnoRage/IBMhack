const mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;
var Schema = mongoose.Schema;
var user = new Schema({
    investorID: {
        type: Number
    },
    userID: {
        type: String
    },
    name: {
        nickname: {
            type: String
        },
        firstName: {
            type: String
        },
        lastName: {
            type: String
        }
    },
    balance: {
        type: Number,
        default: 10000
    },
    organisations: [{}]
}, {
    versionKey: false
});

module.exports = mongoose.model('user', user);