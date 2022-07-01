const MongoClient = require('mongodb').MongoClient;




module.exports = class Connection {

    static db = null;

    static async getDB(){
        if(this.db === null)
        {
           // const mongodb = null;
            const mongdburi = process.env.MONGODB_URI;
            const mongoDbName = process.env.MONGODB_DB;
            var mongoClient = await MongoClient.connect(mongdburi);
            this.db = mongoClient.db(mongoDbName);
            console.log('Connection: ', 'Creando conexión a MongoDB');
        } else{
            console.log('Connection: ', 'Usando conexión cacheada a MongoDB');
        }
        return this.db;

    }
}

