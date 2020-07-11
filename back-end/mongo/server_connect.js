const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
// const url = 'mongodb://localhost:27017';
// Database Name
// const dbName = 'myproject';
// Create a new MongoClient
// const client = new MongoClient(url);

const uri = "mongodb+srv://user_01:Anh3K6yBolbqyKmo@shopcheck.3ltnq.mongodb.net/ShopCheck?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Use connect method to test connection to database.
function ConnectionTest(){
  client.connect(function(err,client) {
    if (err) console.error(err);
    console.log("Connected successfully to server");
    client.close();
  });
}

// To Do: Move to separate user class for full Users CRUD
// Find user in database
function readUser(username,callback){
  client.connect(function(err,cli){
    const db = cli.db('ShopCheck');
    const collection = db.collection('Users');

    collection.find({username}).limit(1).each((err,entry)=>{
      assert.equal(null,err);
      client.close();


      if(entry) {
        callback(entry);
        return false;
      }
      callback(null);
    })
  })
}

// Insert new user to database
function insertUser(user){
  client.connect(function(err,cli){
    const db = cli.db('ShopCheck');
    const collection = db.collection('Users');

    collection.insertOne({'username':user['username'],'password':user['password'],'email':user['email']}, function(err,r){
      assert.equal(null,err);
      assert.equal(1,r.insertedCount);

      client.close();
    })
  })
}

//insertUser({'username':'hellggo','password':'abcdefg','email':'yuhh@gmail.com'});
//readUser('hello',entry=>{console.log(entry)});
//readUser('hellggo',entry=>{console.log(entry)});

module.exports={
  ConnectionTest:ConnectionTest,
  insertUser:insertUser,
  readUser:readUser
}