const mongoose = require('mongoose');
const Room = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    games: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Room', Room);