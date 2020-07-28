const Router = require('express-promise-router');
const jwt = require("jsonwebtoken");
const mongo = require('../mongo/mongo');
const router = new Router()

router.post('/add', async (req,res)=>{
    console.log("Add Order Request Recieved");

    let payload = req.body;

    //Verify Auth Token
    if(payload['token'] != null){
        let secret = await mongo.Configs.getSecret();
        let auth = jwt.verify(payload['token'], secret, function (err, load){
            if (err) {
                return null;
            }
            return load["id"];
        });

        //Checks for integrity
        if(payload["username"] == auth){
            //Payload contains all necessary information. Note that this can always be more secure.
            let _id = await mongo.Order.addOrder(payload);
            res.json({status:'success', message:"Order Added!", _id:_id});
            return;
        }
    }

    res.json({status:'failed', message:"Authentication Failed"});
});


router.post('/query', async (req,res)=>{
    console.log("Query Orders Request Recieved");

    let payload = req.body;

    //Verify Auth Token
    if(payload['token'] != null){
        let secret = await mongo.Configs.getSecret();
        let auth = jwt.verify(payload['token'], secret, function (err, load){
            if (err) {
                return null;
            }
            return load["id"];
        });

        //Checks for integrity
        if(payload["username"] == auth){
            //Payload contains all necessary information. Note that this can always be more secure.
            let orders = await mongo.Order.getOrders(payload['query']);
            res.json({status:'success', message:"Order Query Success!", orders:orders});
            return;
        }
    }

    res.json({status:'failed', message:"Authentication Failed"});
});


router.post('/get', async (req,res)=>{
    console.log("Get Orders Request Recieved");

    let payload = req.body;

    //Verify Auth Token
    if(payload['token'] != null){
        let secret = await mongo.Configs.getSecret();
        let auth = jwt.verify(payload['token'], secret, function (err, load){
            if (err) {
                return null;
            }
            return load["id"];
        });

        //Checks for integrity
        if(payload["username"] == auth){
            //Payload contains all necessary information. Note that this can always be more secure.
            let orders = await mongo.Order.getAllOrders(payload['username']);
            res.json({status:'success', message:"Order Query Success!", orders:orders});
            return;
        }
    }

    res.json({status:'failed', message:"Authentication Failed"});
});

router.post('/update', async (req,res)=>{
    console.log("Update Order Request Recieved");

    let payload = req.body;

    //Verify Auth Token
    if(payload['token'] != null){
        let secret = await mongo.Configs.getSecret();
        let auth = jwt.verify(payload['token'], secret, function (err, load){
            if (err) {
                return null;
            }
            return load["id"];
        });

        //Checks for integrity
        if(payload["username"] == auth){
            //Payload contains all necessary information. Note that this can always be more secure.
            let orders = await mongo.Order.updateOrder(payload["_id"], payload);
            res.json({status:'success', message:"Order Update Success!"});
            return;
        }
    }

    res.json({status:'failed', message:"Authentication Failed"});
});

module.exports = router;