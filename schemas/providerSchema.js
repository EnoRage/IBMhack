const mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;
var Schema = mongoose.Schema;
var provider = new Schema({
    providerID: {
        type: String
    },
    name: {
        type: String,
        default: 'no name'
    },
    address: {
        type: String,
    },
    balance: {
        type: Number
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('provider', provider);