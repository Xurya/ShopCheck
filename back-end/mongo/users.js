class Users {
    constructor(db) {
        this.collection = db.collection('Users');
    }
    async addUser(user){
        let val = await this.collection.insertOne(
            {
                'username':user['username'],
                'password':user['password'],
                'email':user['email'],
                'salt': user['salt'],
                'accountType': user['type']
            });
        return val.insertedCount;
    }
    async getUser(username){
        let user = await this.collection.find({username}).toArray();
        return user;
    }
    async addRefresh(user){
        let val = await this.collection.updateOne({'username': user['username']},
        { $set: {
                'refresh': user['refresh']
        }});
    }
}

module.exports = Users