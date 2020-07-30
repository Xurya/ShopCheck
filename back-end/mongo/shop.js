class Shop {
    constructor(db) {
        this.collection = db.collection('Shop');
    }
    async addShop(shop){
        let val = await this.collection.insertOne(
            {
                'owner':shop['username'],
                'ownerID':shop['id'],
                'name': shop['name'],
                'status':false,
                'inventory': []
            });
        return val.insertedCount;
    }
    async getShop(owner){
        let shop = await this.collection.find({owner}).toArray();
        return shop;
    }
    async getAllShops(){
        let shops = await this.collection.find({'status':true}).toArray();
        return shops;
    }
    async updateShop(shop_id, username, changeObj){
        let changes = {};
        changes[changeObj['field']] = changeObj['value'];
        let val = await this.collection.updateOne({'_id':shop_id, 'owner':username},{$set:changes},{upsert:false});
        return val;
    }
}

module.exports = Shop