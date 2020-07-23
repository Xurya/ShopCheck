const Router = require('express-promise-router');
const mongo = require('../mongo/mongo');
const router = new Router();


router.post('/register', async (req,res)=>{
    console.log('Register request recieved')

    let payload = req.body;
    console.log(payload);
    //Check payload:
    //let response = "" + checkPayload('register', payload);
    
    let query_resp = await mongo.Users.getUser(payload.username);
    if (query_resp.length) res.json({status:'fail', message:'User already exists.'});
    else{
        mongo.Users.addUser(payload);
        res.json({status:'success', message:'Successfully registered.'});
    }
});


router.post('/login', async (req,res)=>{
    console.log('Login request recieved');

    let payload = req.body;
    console.log(payload);

    //Check payload:
    //let response = "" + checkPayload('login', payload);
    
    let query_resp = await mongo.Users.getUser(payload.username);
    if (!query_resp.length || query_resp[0].password != payload.password) res.json({status:'fail', message:'Credentials don\'t match'});
    else{
        console.log(query_resp,payload);
        res.json({status:'success', message:`Logged into ${query_resp[0].username}.`})
    }
});




module.exports = router;