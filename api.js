const mongoose = require('mongoose');
const crypto = require('crypto');

let db = mongoose.connect('mongodb://heroku_969m2gr9:d0ljj3k0df4v7psa45cn26u376@ds129098.mlab.com:29098/heroku_969m2gr9');
let User = require('./models/User.js');
let Room = require('./models/Room.js');
let Game = require('./models/Game.js');

exports.createUser = function(userData) {
    let user = {
        username: userData.username,
        email: userData.email,
        password: hash(userData.password)
    };
    mongoose.connection.collections['users'].insertOne(user);
    console.log(user);
    return new User(user).save()
};

exports.updateUser = function(userName, games) {
    return User.findOne({username:userName}).then(function(user) {
        console.log(user);
        games.forEach((game) => {
            console.log('game: ' + game);
            console.log('game id ' + game._id);
            getGame(game.name).then(function(game) {
                user.games.push(game._id);
            });
        });
        console.log(user.games);
        User(user).save();
        return Promise.resolve(user);
    })
};

exports.getUser = function(name) {
    return User.findOne({username: name}).then(function(user) {
       return Promise.resolve(user);
    });
};

exports.checkUser = function(userData) {

    return User.findOne({username:userData.username}).then(function(doc) {
        console.log('doc is: ' + doc);
        if ( doc.password == hash(userData.password) ) {
            console.log('The password is okay');
            return Promise.resolve(doc)
        } else {
            console.log('The password is Wrong');
            return Promise.reject('Reject Wrong')
        }
    })
};

function hash(text) {
    return crypto.createHash('sha1').update(text).digest('base64')
}

exports.loadUser = function(req, res, next, previous) {
    if (req.session.user) {
        User.findById(req.session.user.id, function(err, user) {
            if (user) {
                req.currentUser = user;
                next();
            } else {
                previous();
            }
        });
    } else {
        previous();
    }
};

exports.createGame = function(name) {
    let game = {
        name: name
    };
    mongoose.connection.collections['games'].insertOne(game);
    return new Game(game).save()
};

getGame = function(name) {
    return Game.findOne({name: name}).then(function(game) {
        return Promise.resolve(game);
    });
};

exports.getUserGames = function(user) {

};

exports.createRoom = function(params) {
    let room = {
        username: userData.username,
        email: userData.email,
        password: hash(userData.password)
    };
    mongoose.connection.collections['rooms'].insertOne(room);
    console.log(room);
    return new Room(room).save()
};

exports.getRooms = function(params) {

};