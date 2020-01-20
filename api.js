const mongoose = require('mongoose');
const crypto = require('crypto');

let db = mongoose.connect('mongodb://heroku_969m2gr9:d0ljj3k0df4v7psa45cn26u376@ds129098.mlab.com:29098/heroku_969m2gr9');
let User = require('./models/User.js');
let Room = require('./models/Room.js');
let Game = require('./models/Game.js');

exports.createRoom = function(user) {
    let room = {
        username: user.name,
        games: user.games
    };
    mongoose.connection.collections['rooms'].insertOne(room);
    console.log(room);
    return new Room(room).save()
};

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

exports.getGame = function(id) {
    return Game.findOne({gameID: id}).then(function(game) {
        return Promise.resolve(game);
    });
};

// exports.getGames = function(arr) {
//     return Game.find({gameID: arr}).then(function(games) {
//         return Promise.resolve(games);
//     });
// };

exports.getGames = (arr) => Game.find({ gameID: arr }).then((games) => Promise.resolve(games));

exports.updateUser = function(userName, games, icon) {
    return User.findOne({username:userName}).then(function(user) {
        // games.forEach((game) => {
        //     getGame(game.name).then(function(gameItem) {
        //         console.log(gameItem._id);
        //         user.games.push(gameItem._id);
        //     });
        // });
        if(icon) user.icon = icon;
        user.games = games;
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

exports.createGame = function(id, name, icon) {
    let game = {
        gameID: id,
        name: name,
        iconURL: icon
    };
    mongoose.connection.collections['games'].insertOne(game);
    return new Game(game).save()
};

exports.getRoom = (id) => Room.find({id}).then((room) => Promise.resolve(room));

exports.getRooms = (games) => Room.find({ games }).then((rooms) => Promise.resolve(rooms));
