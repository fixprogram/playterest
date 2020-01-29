const mongoose = require('mongoose');
const crypto = require('crypto');

let db = mongoose.connect('mongodb://heroku_969m2gr9:d0ljj3k0df4v7psa45cn26u376@ds129098.mlab.com:29098/heroku_969m2gr9');
let User = require('./models/User.js');
let Game = require('./models/Game.js');

exports.createUser = function(userData) {
    let user = {
        username: userData.username,
        email: userData.email,
        password: hash(userData.password)
    };
    mongoose.connection.collections['users'].insertOne(user);
    return new User(user).save()
};

exports.getGame = function(id) {
    return Game.findOne({gameID: id}).then(function(game) {
        return Promise.resolve(game);
    });
};

exports.getGames = (arr) => Game.find({ gameID: arr }).then((games) => Promise.resolve(games));

exports.updateUser = function(userName, games, icon) {
    return User.findOne({ username: userName }).then(function(user) {
        if(icon) user.icon = icon;
        user.games = games;
        User(user).save();
        return Promise.resolve(user);
    })
};

exports.getNotices = function(userID) {
    return User.findOne({ _id: userID }).then(function(user) {
        return Promise.resolve(user);
    })
};

exports.addNotice = function(userID, content, type) {
    let notice = { content, type };
    return User.findOne({ _id: userID }).then(function(user) {
        user.notices.push(notice);
        User(user).save();
        return Promise.resolve(user);
    })
};

exports.addFriend = function(user, content, type) {
    return User.findOne({ username: user }).then(function(user) {
        let userName = user.username;
        let userIcon = user.icon;
        let userID = user._id;
        let notice = user.notices.filter((notice) => notice.content === content);
        let i = user.notices.indexOf(notice);
        if(type === 'addToFriend') {
            let count = false;
            let arr = notice[0].content.split(' ');
            let friendName = arr.slice(-1)[0];
            return User.findOne({ username: friendName }).then((userFriend) => {
                let friendIcon = userFriend.icon;
                let friendID = userFriend._id;
                let messages = [];
                user.friends.forEach((friend) => {
                    if(friend === friendName) count = true;
                });
                if(!count) {
                    let friendData = { name: friendName, icon: friendIcon, id: friendID, messages };
                    let userData = { name: userName, icon: userIcon, id: userID, messages };
                    user.friends.push(friendData);
                    userFriend.friends.push(userData);
                    user.notices.splice(i, 1);
                }

                User(userFriend).save();
                User(user).save();
                return Promise.resolve(user);
            });
        }
    })
};

exports.getUser = function(name) {
    return User.findOne({ username: name }).then(function(user) {
       return Promise.resolve(user);
    });
};

exports.checkUser = function(userData) {

    return User.findOne({ username: userData.username }).then(function(doc) {
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

exports.createGame = function(id, name, icon, genres) {
    let game = {
        gameID: id,
        name: name,
        iconURL: icon,
        genres
    };
    mongoose.connection.collections['games'].insertOne(game);
    return new Game(game).save()
};

exports.messageToFriend = (me, friendName, message, time) => {
    return User.findOne({ username: me }).then(function(user) {
        let msg = { text: message, time, me };
        user.friends.forEach((friend) => {
            if(friend.name === friendName) {
                console.log(msg);
                friend.messages.push(msg);
            }
        });
        User(user).save();
    });
};