const mongoose = require('mongoose');
const crypto = require('crypto');

let db = mongoose.connect('mongodb://heroku_969m2gr9:d0ljj3k0df4v7psa45cn26u376@ds129098.mlab.com:29098/heroku_969m2gr9');
let User = require('./models/User.js');

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
        user.games = games;
        User(user).save();
        return Promise.resolve(user);
    })
};

exports.getUser = function(id) {
    return User.findOne({id})
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