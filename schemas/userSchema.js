
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var user = new Schema({
    user_id: {
        type: String
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('user', user);