const express = require('express');
const app = express();
const mongo = require('./mongo/mongo');
const mountRoutes = require('./routes');


const PORT = process.env.PORT || 5000;

async function start(app){
    try{
        await mongo.init();
        app.use(express.json({limit:'1mb'}));
        app.listen(PORT,()=>{console.log(`Server Listening on Port ${PORT}`)});
        mountRoutes(app);
    }
    catch (exception){
        console.error(exception);
    }
}

start(app);