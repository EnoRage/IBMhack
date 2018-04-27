const mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;
var Schema = mongoose.Schema;
var user = new Schema({
    investorID: {
        type: String
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
        type: String
    },
    organisationID: [{type: String}]
}, {
    versionKey: false
});

module.exports = mongoose.model('user', user);