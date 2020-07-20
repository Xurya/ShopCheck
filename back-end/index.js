const express = require('express');
const app = express();
const mongo = require('mongodb');
var crypto = require('crypto');
crypto.DEFAULT_ENCODING = 'hex';
var jwt = require("jsonwebtoken");
 
const PORT = process.env.PORT || 5000;
var secret = crypto.randomBytes(16).toString("base64");
var dateObj = new Date();


app.listen(PORT,()=>{console.log(`Server Listening on Port ${PORT}`)});
app.use(express.json({limit:'1mb'}));


app.post('/account/register',(req,res)=>{
    console.log('Register request recieved')

    var payload = req.body;
    console.log(payload);

    //Check payload:
    var response = "" + checkPayload('register', payload);

    if(response == 'success'){
        res.json({
            status: 'success',
            message: 'recieved registration'
        })
    }else{
        res.json({
            status: 'fail',
            message: response
        })
    }
});


app.post('/account/login',(req,res)=>{
    console.log('Login request recieved');

    var payload = req.body;
    console.log(payload);

    //Check payload:
    var response = "" + checkPayload('login', payload);

    if(response == 'success'){
        res.json({
            status: 'success',
            message: 'recieved registration'
        })
    }else{
        res.json({
            status: 'fail',
            message: response
        })
    }
});

function checkPayload(type, payload){

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

        //If authentication is correct, create JWT token 
        var token = jwt.sign({ id: payload["username"] }, secret, {
            expiresIn: 900 //Seconds, 15 minutes.
        });

        console.log("TOKEN: " + token);
    }


    
    //TODO: Convert to [message, token on success for login]
    return 'success';
}