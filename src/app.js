const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 3000 // Подключаться по этому хосту.. На 3010 сервак
const path = require('path')
const hbs = require('hbs')

const views = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
const publicDirectoryPath = path.join(__dirname, '../templates/assets') 

app.set('view engine', 'hbs')
app.set('views', views)
hbs.registerPartials(partialsPath)
app.use(express.static(publicDirectoryPath))

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
    res.render('index', {data: messages, tag: game})
  })
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