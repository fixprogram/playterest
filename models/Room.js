const mongoose = require('mongoose');
const Room = new mongoose.Schema({
    user: {
        type: String,
        unique: true,
        required: true
    },
    games: {
        type: Array,
        required: true
    },
    users: {
        type: Array
    }
});

module.exports = mongoose.model('Room', Room);