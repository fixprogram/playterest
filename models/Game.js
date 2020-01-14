const mongoose = require('mongoose');
const Game = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    }
});

module.exports = mongoose.model('Game', Game);