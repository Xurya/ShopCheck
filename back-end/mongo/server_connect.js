const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
// const url = 'mongodb://localhost:27017';
// Database Name
// const dbName = 'myproject';
// Create a new MongoClient
// const client = new MongoClient(url);

const uri = "mongodb+srv://user_02:qmZKKxnWhDTFt8rY@shopcheck.3ltnq.mongodb.net/ShopCheck?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Use connect method to test connection to database.
function ConnectionTest(){
  client.connect(function(err,cli) {
    if (err) console.error(err);
    console.log("Connected successfully to server");
    cli.close();
  });
}

module.exports={
  ConnectionTest:ConnectionTest
}