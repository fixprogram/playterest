const mongoose = require('mongoose');
const User = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        unique: true,
        required: true
    },
    indexes: [
        [{email: 1}, {unique: true}]
    ],
});

module.exports = mongoose.model('User', User);