const mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;
var Schema = mongoose.Schema;
var organisation = new Schema({
    organisationID: {
        type: Number
    },
    name: {
        type: String,
        default: 'no name'
    },
    foundedDate: {
        type: Number
    },
    capital: {
        type: Number
    },
    country: {
        type: String
    },
    mission: {
        type: String
    },
    address: {
        type: String
    },
    balance: {
        type: Number
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('organisation', organisation);