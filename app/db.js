module.exports = {
    mongodb: require('mongodb').MongoClient,
    connectionUrl: 'mongodb://127.0.0.1:27017',
    dbName: 'chat',

    getCollection: function(app) {
        module.exports.mongodb.connect(module.exports.connectionUrl, (error, client) => {
            if(error) console.log(error)

            const db = client.db(module.exports.dbName);
            
            app.locals.collection = db.collection('messages');

            app.listen(3010, () => {
                console.log('Сервер ожидает подключения...')
            });
        });
    },

    writeMessage: function(messageTag, messageContent) {
        module.exports.mongodb.connect(module.exports.connectionUrl, (error, client) => {
            if (error) console.log('Unable to connect to the database');
        
            const db = client.db(module.exports.dbName)
            const dbMessages = db.collection('messages')
            
            dbMessages.insertOne({
                tag: messageTag,
                text: messageContent
            })
        })
    }
}