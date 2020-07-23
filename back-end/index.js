const express = require('express');
const app = express();
const mongo = require('./mongo/mongo');
const mountRoutes = require('./routes');

const crypto = require('crypto');
const jwt = require("jsonwebtoken");


const PORT = process.env.PORT || 5000;
const secret = crypto.randomBytes(32).toString("hex"); //TODO: store in database and retrieve on start. 
//For scalability write seperate script that generates secrets at long intervals (one or twice a day) and updates database secret
//Probably do this in config/auth.config.js

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

app.post('/account/refresh',(req,res)=>{
    console.log('Refresh request recieved');

    var payload = req.body;
    console.log(payload);

    //Check payload:
    var response = "" + checkPayload('refresh', payload);

    if(response == 'fail'){
        res.json({
            status: 'fail',
            message: 'invalid token'
        })
    }else{
        var token = jwt.sign({ id: payload["username"] }, secret, {
            expiresIn: 900
        });

        res.json({
            status: 'success',
            token: token
        })
    }
})

function checkPayload(type, payload){
    //TODO: Update local secret by referencing database.

    if(type=="refresh" && payload.hasOwnProperty("refresh") && payload[refresh] != null){
        //TODO: Grab salt and hash from database
        //var salt = 
        //var storedHash =

        //TODO: Salt and hash refresh token
        //var hashedRefresh = crypto.pbkdf2Sync(rrefresh, salt, 100000, 64, 'sha512');

        /*
        if(hashedRefresh == storedHash){
            return "success";
        }

        return "fail";
        */
    }


    //Object.length is not applicable for JSON, so manually count.
    var count=0;
    for(var prop in payload) {
        if (payload.hasOwnProperty(prop) && prop != null && prop != '') {
            count++;
        }
    }

    //Type Specific Rules
    if(type=='register'){
        if (count != 3){
            return 'Required fields cannot be empty or null';
        } else if (!payload["email"].includes('@')) {
            return 'Email must contain an @';
        }
    }else if(type=='login'){
        if (count != 2){
            return 'Required fields cannot be empty or null';
        } 
    }

    //Overlapping Rules
    if(payload["username"].length < 6){
        return 'Username cannot have less than 6 characters';
    }  else if (payload["password"].length < 6){
        return 'Password cannot have less than 6 characters';
    } else if (payload["password"].includes('<') || payload["password"].includes('>')) {
        return 'Password cannot contain tags (less than or greater than signs)';
    }

    if (type=='register') {
        //TODO: Check for database conflict
        
        //If there is no conflict, save user into database

        //Salt and Hash password
        var buf = crypto.randomBytes(16);
        var salt = buf.toString('base64');
        var hashedpass = crypto.pbkdf2Sync(payload["password"], salt, 100000, 64, 'sha512');

        console.log("Username: "+ payload["username"]);
        console.log("Hash: " + hashedpass);
        console.log("Salt: " + salt);

        //TODO: store salt and hash seperately
    } else if (type=='login') {
        //TODO: Check if user exists in database

        //If user exists, check authentication

        //TODO: Salt password

        //TODO: Compare Salted password to database

        //If authentication is correct, create JWT authentication token 
        var token = jwt.sign({ id: payload["username"] }, secret, {
            expiresIn: 900
        });

        //Generate Refresh Token
        var refresh = jwt.sign({ id: payload["username"] }, secret, {
            expiresIn: 86400
        });

        //Hash refresh token and save into database using the same salt as password
        //var hashedRefresh = crypto.pbkdf2Sync(rrefresh, salt, 100000, 64, 'sha512');

        //just jwt.verify for validation. 
    }


    
    //TODO: Convert to [message, token on success for login]
    return 'success';
}