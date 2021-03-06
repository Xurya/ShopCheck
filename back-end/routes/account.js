const Router = require('express-promise-router');
const mongo = require('../mongo/mongo');
const router = new Router();

const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const { Console } = require('console');

router.post('/register', async (req,res)=>{
    console.log('Register request recieved')

    let payload = req.body;
    
    //Check payload:

    let count = countJson(payload);

    if (count != 4){
        res.json({status:'failed', message:"Required fields cannot be empty or null"});
        return;
    } else if (!payload["email"].includes('@')) {
        res.json({status:'failed', message:'Email must contain an @'});
        return;
    } else if(!payload["type"]=="Owner" && !payload["type"]=="Buyer"){
        res.json({status:'failed', message:'Invalid Account Type'});
        return;
    }

    let overlap = checkOverlap(payload);

    if(overlap != "success"){
        res.json({status:'failed', message: overlap});
        return;
    }

    //Check for database conflict
    let query_resp = await mongo.Users.getUser(payload.username);    
    if (query_resp.length) {
        res.json({status:'fail', message:'User already exists.'});
        return;
    }

    //Salt and Hash password
    var salt = crypto.randomBytes(16).toString('base64');
    var hashedpass = crypto.pbkdf2Sync(payload["password"], salt, 100000, 64, 'sha512');

    mongo.Users.addUser({username: payload["username"], password: hashedpass, email: payload["email"], salt: salt, type:payload["type"]});

    res.json({status:'success', message:'Successfully registered.'});
});

router.post('/refresh', async (req,res)=>{
    console.log('Refresh request recieved');

    var payload = req.body;

    let query_resp = await mongo.Users.getUser(payload.username);    
    if (!query_resp.length) {
        res.json({status:'fail', message:'Invalid Refresh'});
        return;
    }

    let dbUser = query_resp[0];

    //Check payload:
    var salt = dbUser["salt"]; 
    var storedHash = dbUser["refresh"];

    //Salt and hash refresh token
    var hashedRefresh = crypto.pbkdf2Sync(payload["refresh"], salt, 100000, 64, 'sha512');

    if(hashedRefresh.toString() == storedHash.toString()){
        let secret = await mongo.Configs.getSecret();
        var token = jwt.sign({ id: payload["username"] }, secret, {
            expiresIn: 900
        });

        res.json({
            status: 'success',
            token: token
        })
    }else{
        res.json({
            status: 'fail',
            message: 'Invalid Refresh'
        })
    }
});


router.post('/login', async (req,res)=>{
    console.log('Login request recieved');

    let payload = req.body;

    //Check payload:
    let count = countJson(payload);

    if (count != 2){
        res.json({status:'fail', message:'Required fields cannot be empty or null'});
        return;
    } 

    let overlap = checkOverlap(payload);

    if(overlap != "success"){
        res.json({status:'failed', message: overlap});
        return;
    }

    let query_resp = await mongo.Users.getUser(payload.username);    
    if (!query_resp.length) {
        res.json({status:'fail', message:'Credentials don\'t match'});
        return;
    }

    let dbUser = query_resp[0];

    //If user exists, check authentication
    let hashedPassword = dbUser["password"].buffer;
    let salt = dbUser["salt"];

    //Salt password
    let inputHash = crypto.pbkdf2Sync(payload["password"], salt, 100000, 64, 'sha512');

    //Compare Salted password to database
    if(inputHash.toString() != hashedPassword.toString()){
        res.json({status:'fail', message:'Credentials don\'t match'});
        return;
    }

    //If authentication is correct, create JWT authentication token 
    let secret = await mongo.Configs.getSecret();
    var token = jwt.sign({ id: payload["username"] }, secret, {
        expiresIn: 900
    });

    //Generate Refresh Token
    var refresh = jwt.sign({ id: payload["username"] }, secret, {
        expiresIn: 86400
    });

    //Hash refresh token and save into database using the same salt as password
    var hashedRefresh = crypto.pbkdf2Sync(refresh, salt, 100000, 64, 'sha512');
    mongo.Users.addRefresh({username:payload["username"], refresh:hashedRefresh});

    res.json({status:'success', token: token, refresh: refresh, message:`Logged into ${query_resp[0].username}.`})
});

router.post('/home', async (req,res)=>{
    let secret = await mongo.Configs.getSecret();
    //console.log(req.body.token);
    try {
        let body = jwt.verify(req.body.token, secret);
        let user_data = await mongo.Users.getUser(body.id);
        if (!user_data.length) {
            res.json({status:'fail',message:'Session Verification Failed.'});
        }
        else{
            let entry = user_data[0];
            res.json({status:'success', username: entry.username, email: entry.email, accountType: entry.accountType});
        }
    }
    catch (err){
        if (err instanceof jwt.TokenExpiredError){
            //Check refresh token for validity then return new token with user entry.
            try{
                let body = jwt.verify(req.body.refresh,secret);
                let user_data = await mongo.Users.getUser(body.id);
                if (!user_data.length) {
                    res.json({status:'fail',message:'Session Verification Failed.'});
                }
                else{
                    // using salt from user-entry, take hashed refresh and compare to given refresh after hashing. 
                    let entry = user_data[0];
                    if (crypto.pbkdf2Sync(req.body.refresh, entry.salt, 100000, 64, 'sha512').toString() != entry.refresh.toString()){
                        console.log('Refresh Token Invalid');
                        res.json({status:'fail',message:'Session Verification Failed.'})
                    }
                    else{
                        // return object with new token generated for front-end.
                        console.log('New Token Generated after verifying refresh token.');
                        let newToken = jwt.sign({id:body.id},secret,{expiresIn:900});
                        res.json({status:'success', username: entry.username, email: entry.email, accountType: entry.accountType, newToken});
                    }
                }
            }
            catch (error){
                console.error(error);
                res.json({status:'fail',message:'Session Verification Failed.'})
            }
        }
        else{
            console.error(err);
            res.json({status:'fail',message:'Session Verification Failed.'})
        }
    }
});

function countJson(payload){
    //Object.length is not applicable for JSON, so manually count.
    let count=0;
    for(var prop in payload) {
        if (payload.hasOwnProperty(prop) && prop != null && prop != '') {
            count++;
        }
    }
    return count;
}

function checkOverlap(payload){
    //Overlapping Rules
    if(payload["username"].length < 6){
        return 'Username cannot have less than 6 characters';
    }  else if (payload["password"].length < 6){
        return 'Password cannot have less than 6 characters';
    } else if (payload["password"].includes('<') || payload["password"].includes('>')) {
        return 'Password cannot contain tags (less than or greater than signs)';
    }
    return "success";
}

async function accessToken(token,refresh){
    let secret = await mongo.Configs.getSecret();

    try {
        let body = jwt.verify(token, secret);
        let user_data = await mongo.Users.getUser(body.id);
        if (!user_data.length) {
            return {status:'fail'};
        }
        else{
            let entry = user_data[0];
            return {status:'success', username: entry.username, id: entry._id};
        }
    }
    catch (err){
        if (err instanceof jwt.TokenExpiredError){
            //Check refresh token for validity then return new token with user entry.
            try{
                let body = jwt.verify(refresh,secret);
                let user_data = await mongo.Users.getUser(body.id);
                if (!user_data.length) {
                    return {status:'fail'};
                }
                else{
                    // using salt from user-entry, take hashed refresh and compare to given refresh after hashing. 
                    let entry = user_data[0];
                    if (crypto.pbkdf2Sync(req.body.refresh, entry.salt, 100000, 64, 'sha512').toString() != entry.refresh.toString()){
                        console.log('Refresh Token Invalid');
                        return {status:'fail'};
                    }
                    else{
                        // return object with new token generated for front-end.
                        console.log('New Token Generated after verifying refresh token.');
                        let newToken = jwt.sign({id:body.id},secret,{expiresIn:900});
                        return {status:'success', username: entry.username, id: entry._id, newToken};
                    }
                }
            }
            catch (error){
                return ({status:'fail'});
            }
        }
        else{
            console.error(err);
            return {status:'fail'}
        }
    }
}


module.exports = {
    router,
    accessToken:accessToken
};