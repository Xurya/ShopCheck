const ObjectId = require('mongodb').ObjectID;

class Order {
    constructor(db) {
        this.collection = db.collection('Order');
    }
    async addOrder(order){
        let val = await this.collection.insertOne(
            {
                'shopID:':order['shopID'],
                'username':order['username'],
                'status':false,
                'items': order["items"]
            });
        return val.insertedId; //This should return the _id / order#
    }
    async getOrders(query){
        let orders = await this.collection.find(query).toArray();
        return orders;
    }
    async getAllOrders(username){
        let orders = await this.collection.find({username: username}).toArray();
        return orders;
    }
    async updateOrder(order_id, changeObj){
        let changes = {};
        changes[changeObj['field']] = changeObj['value'];
        let val = await this.collection.updateOne({'_id':new ObjectId(order_id)},{$set:changes},{upsert:false});
        return val;
    }
}

module.exports = Order