const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 2000 // Подключаться по этому хосту.. На 3010 сервак
const path = require('path')
const hbs = require('hbs')

const session = require('express-session')
const passport = require('passport')
const SteamStrategy = require('../lib/passport-steam').Strategy

const views = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
const publicDirectoryPath = path.join(__dirname, '../templates/assets') 

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new SteamStrategy({
  returnURL: 'http://localhost:2000/auth/steam/return',
  realm: 'http://localhost:2000/',
  apiKey: 'CFB0BB3EDA8D5FD2342384380B442CC9'
},
function(identifier, profile, done) {
  process.nextTick(function () {
    profile.identifier = identifier;
    return done(null, profile);
  });
}
));

app.set('view engine', 'hbs')
app.set('views', views)
hbs.registerPartials(partialsPath)
app.use(express.static(publicDirectoryPath))

app.use(session({
  secret: 'your secret',
  name: 'name of session id',
  resave: true,
  saveUninitialized: true}));

app.use(passport.initialize());
app.use(passport.session());

app.use(session({
  secret: 'your secret',
  name: 'name of session id',
  resave: true,
  saveUninitialized: true}));

const mongodb = require('mongodb').MongoClient
const connectionUrl = 'mongodb://127.0.0.1:27017'
const dbName = 'chat'

mongodb.connect(connectionUrl, (error, client) => {

  const db = client.db(dbName)
  
  app.locals.collection = db.collection('messages')
  app.listen(3010, () => {
    console.log('Сервер ожидает подключения...')
  })
})

app.get('/', function(req, res) {
  let game = req.query.game;
  if(game === undefined) game = 'index';
  const collection = app.locals.collection
  collection.find({tag: game}).toArray((error, content) => {
    if(error) return console.log(error)
    let messages = []
    content.forEach((item) => {
      messages += item.text + ', '
    })
    console.log(req.user)
    res.render('index', {data: messages, tag: game, user: req.user })
  })
  
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user, avatar: req.user.photos[2].value });
});

app.get('/logout', function(req, res){
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

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log(msg)
    mongodb.connect(connectionUrl, (error, client) => {
        if (error) {
            console.log('Unable to connect to the database')
        }
    
        const db = client.db(dbName)
        const dbMessages = db.collection('messages')
        
        dbMessages.insertOne({
            tag: msg.tag,
            text: msg.msg
        })
    })

    socket.emit('chat message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}
