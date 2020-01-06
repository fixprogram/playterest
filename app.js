const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000; // Подключаться по этому хосту.. На 3010 сервак
const path = require('path');
const hbs = require('hbs');
const api = require('./api.js');
const steam = require('steam-searcher');
const uuid = require('uuid');

const db = require('./db.js');
db.getCollection(app);

const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const views = path.join(__dirname, 'templates/views');
const partialsPath = path.join(__dirname, 'templates/partials');
const publicDirectoryPath = path.join(__dirname, 'templates/assets');

app.set('view engine', 'hbs');
app.set('views', views);
hbs.registerPartials(partialsPath);
app.use(express.static(publicDirectoryPath));
app.use("/assets", express.static(`${__dirname}/assets`));

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

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
    secret: 'your secret',
    name: 'name of session id',
    resave: true,
    saveUninitialized: true
}));

// Create a user

app.post('/login', function (req, res, next) {

    console.log(req.body.username + ' ' + req.body.password);

    api.checkUser(req.body).then(function (user) {
        if (user) {
            req.session.user = {id: user._id, name: user.username};
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
        res.render('profile');
    }, function () {
        res.redirect('/login')
    })
});

app.get('/', function (req, res) {
    api.loadUser(req, res, function () {
        res.redirect('/home');
    }, function () {
        res.render('index', {title: 'Играй по своим правилам на playterest.'});
    });
});

app.get('/home', function (req, res) {
    let collection = app.locals.collection;
    let game = req.query.game;

    console.log('req.session.user: ' + req.session.user);

    if (game === undefined) game = 'index';

    collection.find({tag: game}).toArray((error, content) => {
        if (error) return console.log(error);

        let messages = [];

        content.forEach((item) => {
            messages += item.text + ', ';
        });

        if (req.session.user) {
            res.render('home', {data: messages, tag: game, user: req.session.user.name});
        } else {
            res.render('home', {data: messages, tag: game, user: false});
        }
    });
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/register', function (req, res) {
    res.render('register');
});

app.get('/search/', function(req, res) {
    res.send('Games page');

    let query = req.query.term;
    if(query) {
        res.redirect('/games/' + query);
    } else {
        res.render('404');
    }
});

app.get('/games/:name', function(req,res) {
    let gameQuery = req.params.name;

    if(gameQuery) {
        steam.find({search: gameQuery}, function (err, game) {
            if (err) res.render('404');
            res.render('game', {data: JSON.stringify(game)});
        });
    } else {
        res.render('404');
    }
});

app.get('/room', function(req, res) {
    // console.log(io.sockets.connected);

    // let socket = io.sockets.connected;
    // console.log(socket);
    //
    // const room = uuid.v4();
    // socket.join(room);

    res.sendFile('room', {nick: req.session.user.name});

    // api.loadUser(req, res, function () {
    //     res.render('room', {nick: req.session.user.name});
    // }, function () {
    //     res.redirect('/login');
    // });
});

// app.post('/game', function (req, res) {
//     let gameQuery = req.body['game-search'];
//
//     if(gameQuery) {
//         steam.find({search: gameQuery}, function (err, game) {
//             if (err) console.log(err);
//             //game is the data as a JSON.
//             res.render('game', {data: JSON.stringify(game)});
//
//             // console.log(JSON.stringify(game));
//
//             // console.log(game);
//         });
//     } else {
//         res.render('404');
//     }
//
// });

var users=[];
var idsnicks={};
io.on('connection', function (socket) {

    socket.on('chat message', function (msg) {
        console.log(msg);

        db.writeMessage(msg.tag, msg.msg);

        socket.emit('chat message', msg);
    });

    socket.on('login', function  (nick) {
        users.push(nick);
        socket.nick=nick;
        idsnicks[nick]=socket.id;
        console.log(users);
        io.emit('userlist', users);
    });

    socket.on('send', function  (data) {
        if (io.sockets.connected[idsnicks[data.usr]]!==undefined) {
            io.sockets.connected[idsnicks[data.usr]].emit('sendmsg', {msg:data.msg, usr:socket.nick});
        }
    });

    socket.on('startchat', function  (data) {
        if (io.sockets.connected[idsnicks[data]]!==undefined) {
            io.sockets.connected[idsnicks[data]].emit('openchat', socket.nick);
        }
    });

    socket.on('disconnect', function () {
        console.log('disc');
        users.splice( users.indexOf(socket.nick), 1 );
        delete idsnicks[socket.nick];
        io.emit('discon', {usr:socket.nick, list:users});


    });

});

http.listen(port, function () {
    console.log('listening on *:' + port);
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
}