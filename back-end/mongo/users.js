class Users {
    constructor(db) {
        this.collection = db.collection('Users');
    }
    async addUser(user){
        await this.collection.insertOne(
            {
                'username':user['username'],
                'password':user['password'],
                'email':user['email'],
                'salt': user['salt']
            });
    }
    async getUser(username){
        let user = await this.collection.find({username}).toArray();
        return user;
    }
}

module.exports = Users