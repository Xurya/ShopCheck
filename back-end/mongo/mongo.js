const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://user_02:qmZKKxnWhDTFt8rY@shopcheck.3ltnq.mongodb.net/ShopCheck?retryWrites=true&w=majority";
const Users = require ('./users');
const Shops = require('./shop');
const Order = require('./order')
const Configs = require ('./config.js');

class MongoU {
    constructor (){
        this.client = new MongoClient("mongodb+srv://user_02:qmZKKxnWhDTFt8rY@shopcheck.3ltnq.mongodb.net/ShopCheck?retryWrites=true&w=majority",{useNewUrlParser:true, useUnifiedTopology:true});
    }
    async init(){
        await this.client.connect();
        console.log('Database Client Connected');
        this.db = this.client.db('ShopCheck');
        this.Users = new Users(this.db);
        this.Configs = new Configs(this.db);
        this.Shops = new Shops(this.db);
        this.Order = new Order(this.db);
        
        //Order Testing
        // let _id = await this.Order.addOrder({'shopID': 'testShop','username': 'testotest','items': ["ice-cream", "snaccs", "pizza"]});
        // var ObjectId = require('mongodb').ObjectID;
        // console.log (new ObjectId(_id));
        // let orders = await this.Order.getOrders({_id:new ObjectId(_id)});
        // console.log(orders);
        // orders = await this.Order.getAllOrders("testotest");
        // console.log(orders);
        // await this.Order.updateOrder(_id, {field:"items",  value:["ice-cream", "sandwich", "snaccs", "doggo"]})

        await this.Configs.init();
    }
}

module.exports = new MongoU();