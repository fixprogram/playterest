module.exports = dataBase = {
    mongodb: require('mongodb').MongoClient,
    connectionUrl: 'mongodb://heroku_969m2gr9:d0ljj3k0df4v7psa45cn26u376@ds129098.mlab.com:29098/heroku_969m2gr9',
    // dbName: 'chat',
    dbName: 'heroku_969m2gr9',

    getCollection: function(app) {
        dataBase.mongodb.connect(dataBase.connectionUrl, (error, client) => {
            if(error) console.log(error);

            // const db = client.db(dataBase.dbName);
            const db = client.db('heroku_969m2gr9');

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
};