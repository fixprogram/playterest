const mongoose = require('mongoose');
const Room = new mongoose.Schema({
    params: {
        type: String,
        unique: true,
        required: true
    },
    games: {
        type: Array
    }
});

module.exports = mongoose.model('Room', Room);