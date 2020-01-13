const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000; // Подключаться по этому хосту.. На 3010 сервак
const path = require('path');
const hbs = require('hbs');
const api = require('./api.js');
const steamSearch = require('steam-searcher');
const uuid = require('uuid');
const passport = require('passport');
const SteamStrategy = require('passport-steam/lib/passport-steam').Strategy;
const steamAPI = require('steamapi');
const steam = new steamAPI('CFB0BB3EDA8D5FD2342384380B442CC9');

const db = require('./db.js');
db.getCollection(app);

const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const views = path.join(__dirname, 'templates/views');
const partialsPath = path.join(__dirname, 'templates/partials');
const publicDirectoryPath = path.join(__dirname, 'templates/assets');

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new SteamStrategy({
        returnURL: 'http://localhost:3000/auth/steam/return',
        realm: 'http://localhost:3000/',
        apiKey: 'CFB0BB3EDA8D5FD2342384380B442CC9'
    },
    function(identifier, profile, done) {
        process.nextTick(function () {
            profile.identifier = identifier;
            return done(null, profile);
        });
    }
));

app.set('view engine', 'hbs');
app.set('views', views);
hbs.registerPartials(partialsPath);
app.use(express.static(publicDirectoryPath));
app.use("/assets", express.static(`${__dirname}/assets`));

const sessionMiddleware = session({
    secret: 'my secret',
    name: 'name of session id',
    resave: true,
    saveUninitialized: true,

    store: new MongoStore({
        url: 'mongodb://heroku_969m2gr9:d0ljj3k0df4v7psa45cn26u376@ds129098.mlab.com:29098/heroku_969m2gr9'
    })
});

io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

app.use(sessionMiddleware);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

// Create a user

app.post('/', function (req, res, next) {

    console.log(req.body.username + ' ' + req.body.password);

    api.checkUser(req.body).then(function (user) {
        if (user) {
            req.session.user = {id: user._id, name: user.username};
            res.redirect('/')
        } else {
            // return next(error)
            console.log(error);
            res.redirect('/?error=true')
        }
    })
        .catch(function (error) {
            // return next(error)
            res.redirect('/?error=true')
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

app.get('/logout', function (req, res, next) {
    if (req.session.user) {
        delete req.session.user;
        res.redirect('/');
    }
});

module.exports = app;

//

app.get('/profile', function (req, res) {
    api.loadUser(req, res, function () {
        res.render('profile', {name: req.session.user.name});
    }, function () {
        res.redirect('/login')
    })
});

app.get('/', function (req, res) {
    api.loadUser(req, res, function () {
        res.redirect('/home');
    }, function () {
        let errorBool = req.query.error;

        if(errorBool) return res.render('index', {error: 'Неверный логин или пароль', title: 'Играй по своим правилам на playterest.'});

        res.render('index', {title: 'Играй по своим правилам на playterest.'});
    });
});

app.get('/home', function (req, res) {
    // let collection = app.locals.collection;
    // let game = req.query.game;
    let searchParams = req.query.params;
    if(searchParams) {
         let params = searchParams.split(';');
         console.log(params);
    }

    // if (game === undefined) game = 'index';

    // collection.find({tag: game}).toArray((error, content) => {
    //     if (error) return console.log(error);
    //
    //     let messages = [];
    //
    //     content.forEach((item) => {
    //         messages += item.text + ', ';
    //     });
    // });

    const searchInfo = {
        name: req.query.name,
        room: req.query.room,
        userName: req.session.user.name,
        userID: req.session.user.id
    };

    if (req.session.user) {
        res.render('home', {userName: req.session.user.name, userID: req.session.user.id, searchInfo});
    } else {
        res.render('home', {user: false});
    }
});

app.get('/register', function (req, res) {
    res.render('register');
});

app.get('/games/:name', function (req, res) {
    let gameQuery = req.params.name;

    if (gameQuery) {
        steamSearch.find({search: gameQuery}, function (err, game) {
            if (err) res.render('404');
            res.render('game', {data: JSON.stringify(game)});
        });
    } else {
        res.render('404');
    }
});

app.get('/search', function (req, res) {
    let query = req.query.term;
    if (query) {
        res.redirect('/games/' + query);
    } else {
        res.render('404');
    }
});

app.get('/room', function (req, res) {

    res.render('room', {name: req.query.name, room: req.query.room, userName: req.session.user.name, userID: req.session.user.id});

});

app.get('/auth/steam',
    passport.authenticate('steam', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/');
    });

app.get('/auth/steam/return',
    passport.authenticate('steam', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/');
    });

app.get('/account', function(req, res) {
    steam.getUserOwnedGames('76561198047924663').then(summary => {
        // console.log(summary);
        res.send(summary);
        summary.forEach((game) => {
            db.writeMessage(game.name);
        })
    });
});

io.on('connection', (socket) => {

    socket.on('chat message', function (msg) {
        console.log(msg);

        db.writeMessage(msg.tag, msg.msg);

        socket.emit('chat message', msg);
    });

    socket.on('sendMessage', ({message, userID}, callback) => {
        const user = getUser(userID);

        io.to(user.room).emit('message', { user: user.userName, text: message });

        // callback();
    });

    socket.on('join', ({ userID, userName, room = 'home' }, callback) => {
        const { error, user } = addUser({ socketID: socket.id, id: userID, userName, room });

        if(error) return callback(error);

        socket.join(user.room);

        socket.emit('message', { user: 'admin', text: `${user.userName}, welcome to room ${user.room}.`});
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.userName} has joined!` });

        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

        callback();
    });

    socket.on('disconnect', (callback) => {
        const user = removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('message', { user: 'admin', text: `${user.userName} has left.` });
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
        }
    })

});

http.listen(port, function () {
    console.log('listening on *:' + port);
});