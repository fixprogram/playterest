module.exports = dataBase = {
    mongodb: require('mongodb').MongoClient,
    connectionUrl: 'mongodb://127.0.0.1:27017',
    dbName: 'chat',

    getCollection: function(app) {
        dataBase.mongodb.connect(dataBase.connectionUrl, (error, client) => {
            if(error) console.log(error);

            const db = client.db(dataBase.dbName);
            
            app.locals.collection = db.collection('messages');

            app.listen(3010, () => {
                console.log('Сервер ожидает подключения...');
            });
        });
    },

    writeMessage: function(messageTag, messageContent) {
        dataBase.mongodb.connect(dataBase.connectionUrl, (error, client) => {
            if (error) console.log('Unable to connect to the database');
        
            const db = client.db(dataBase.dbName);
            const dbMessages = db.collection('messages');
            
            dbMessages.insertOne({
                tag: messageTag,
                text: messageContent
            })
        })
    }
}