const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://user_02:qmZKKxnWhDTFt8rY@shopcheck.3ltnq.mongodb.net/ShopCheck?retryWrites=true&w=majority";
const Users = require ('./users');

class MongoU {
    constructor (){
        this.client = new MongoClient("mongodb+srv://user_02:qmZKKxnWhDTFt8rY@shopcheck.3ltnq.mongodb.net/ShopCheck?retryWrites=true&w=majority",{useNewUrlParser:true, useUnifiedTopology:true});
    }
    async init(){
        await this.client.connect();
        console.log('Database Client Connected');
        this.db = this.client.db('ShopCheck');
        this.Users = new Users(this.db);
    }
}

module.exports = new MongoU();