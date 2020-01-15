const mongoose = require('mongoose');
const Game = new mongoose.Schema({
    gameID: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        unique: true,
        required: true
    },
    iconURL: {
        type: String,
        unique: true,
        required: true
    }
});

module.exports = mongoose.model('Game', Game);