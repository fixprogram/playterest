const mongoose = require('mongoose');
const User = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    icon: {
        type: String
    },
    games: {
        type: Array
    },
    friends: {
        type: Array
    },
    notices: {
        type: Array
    }
});

module.exports = mongoose.model('User', User);