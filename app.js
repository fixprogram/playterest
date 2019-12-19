const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000; // Подключаться по этому хосту.. На 3010 сервак
const path = require('path');
const hbs = require('hbs');

const db = require('./db.js');
db.getCollection(app);

const session = require('express-session');

const passport = require('./authentification').getPassport();

const views = path.join(__dirname, 'templates/views');
const partialsPath = path.join(__dirname, 'templates/partials');
const publicDirectoryPath = path.join(__dirname, 'templates/assets');

app.set('view engine', 'hbs');
app.set('views', views);
hbs.registerPartials(partialsPath);
app.use( express.static(publicDirectoryPath) );

app.use(session({
  secret: 'your secret',
  name: 'name of session id',
  resave: true,
  saveUninitialized: true}) );

app.use(passport.initialize());
app.use(passport.session());

app.use(session({
  secret: 'your secret',
  name: 'name of session id',
  resave: true,
  saveUninitialized: true}) );

app.get('/', function(req, res) {
  let collection = app.locals.collection;
  let game = req.query.game;

  console.log(req.query.game);

  if(game === undefined) game = 'index';

  collection.find({tag: game}).toArray( (error, content) => {
    if(error) return console.log(error);

    let messages = [];

    content.forEach((item) => {
      messages += item.text + ', ';
    });

    console.log(req.user);
    res.render('index', {data: messages, tag: game, user: req.user });
  });
});

app.get('/account', ensureAuthenticated, function(req, res) {
  res.render('account', { user: req.user, avatar: req.user.photos[2].value });
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
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

io.on('connection', function(socket) {
  socket.on('chat message', function(msg) {
    console.log(msg);

    db.writeMessage(msg.tag, msg.msg);

    socket.emit('chat message', msg);
  });
});

http.listen(port, function() {
  console.log('listening on *:' + port);
});

function ensureAuthenticated(req, res, next) {
  if ( req.isAuthenticated() ) return next(); 
  res.redirect('/');
}
