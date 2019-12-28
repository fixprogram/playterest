const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000; // Подключаться по этому хосту.. На 3010 сервак
const path = require('path');
const hbs = require('hbs');
const api = require('./api.js');

const db = require('./db.js');
db.getCollection(app);

const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const passport = require('./authentification').getPassport();

const views = path.join(__dirname, 'templates/views');
const partialsPath = path.join(__dirname, 'templates/partials');
const publicDirectoryPath = path.join(__dirname, 'templates/assets');

app.set('view engine', 'hbs');
app.set('views', views);
hbs.registerPartials(partialsPath);
app.use(express.static(publicDirectoryPath));

app.use(session({
        secret: 'your secret',
        name: 'name of session id',
        resave: false,
        saveUninitialized: false,

        store: new MongoStore({
            url: 'mongodb://heroku_969m2gr9:d0ljj3k0df4v7psa45cn26u376@ds129098.mlab.com:29098/heroku_969m2gr9'
        })
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: 'your secret',
    name: 'name of session id',
    resave: true,
    saveUninitialized: true
}));

// Create a user

app.post('/login', function (req, res, next) {
    if (req.session.user) return res.redirect('/');

    console.log(req.body.username + ' ' + req.body.password);

    api.checkUser(req.body).then(function (user) {
        if (user) {
            req.session.user = {id: user._id, name: user.name};
            res.redirect('/')
        } else {
            return next(error)
        }
    })
        .catch(function (error) {
            return next(error)
        })
});

app.post('/register', function (req, res, body) {
    api.createUser(req.body).then(function (result) {
        console.log("User created");
    })
        .catch(function (err) {
        if (err.toJSON().code == 11000) {
            res.status(500).send("This email is already exists");
        }
    });

    res.redirect('/login');
});

app.get('/logout', function(req, res, next) {
    if (req.session.user) {
        delete req.session.user;
        res.redirect('/');
    }
});

module.exports = app;

//

app.get('/profile', api.loadUser, function(req, res) {
    res.render('profile');
});

app.get('/', function (req, res) {
    let collection = app.locals.collection;
    let game = req.query.game;

    console.log(req.session.user);

    if (game === undefined) game = 'index';

    collection.find({tag: game}).toArray((error, content) => {
        if (error) return console.log(error);

        let messages = [];

        content.forEach((item) => {
            messages += item.text + ', ';
        });

        res.render('index', {data: messages, tag: game, user: req.user});
    });
});

app.get('/login', function(req, res) {
    res.render('login');
});

app.get('/register', function(req, res) {
    res.render('register');
});

// app.get('/account', ensureAuthenticated, function (req, res) {
//     res.render('account', {user: req.user, avatar: req.user.photos[2].value});
// });
//
// app.get('/logout', function (req, res) {
//     req.logout();
//     res.redirect('/');
// });
//
// app.get('/auth/steam',
//     passport.authenticate('steam', {failureRedirect: '/'}),
//     function (req, res) {
//         res.redirect('/');
//     });
//
// app.get('/auth/steam/return',
//     passport.authenticate('steam', {failureRedirect: '/'}),
//     function (req, res) {
//         res.redirect('/');
//     });

io.on('connection', function (socket) {
    socket.on('chat message', function (msg) {
        console.log(msg);

        db.writeMessage(msg.tag, msg.msg);

        socket.emit('chat message', msg);
    });
});

http.listen(port, function () {
    console.log('listening on *:' + port);
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
}
