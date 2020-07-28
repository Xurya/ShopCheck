const Router = require('express-promise-router');
const mongo = require('../mongo/mongo');
const {accessToken} = require('./account');
const router = new Router();

router.post('/addShop', async (req,res) =>{
    let payload = req.body
    let verify = await accessToken(payload.token,payload.refresh);
    if (verify.status == 'fail') res.json({status: 'fail', message: 'Session Verification Failed'});
    else {
        let value = await mongo.Shops.addShop({
            'owner': verify.username,
            'ownerID': verify.id,
            'name': payload['name'],
        });
        if (!value){
            res.json({status:'fail', message:'Shop Creation Failed', newToken: verify.newToken});
        }
        else{
            res.json({status:'success', message:'Shop Creation Succeeded', newToken: verify.newToken});
        }
    }
});

router.post('/getShop', async (req,res) =>{
    let payload = req.body
    let verify = await accessToken(payload.token,payload.refresh);
    if (verify.status == 'fail') res.json({status: 'fail', message: 'Session Verification Failed'});
    else {
        let value = await mongo.Shops.getShop(verify.username);
        res.json({status:'success', message: 'user-owned shops returned', shops: value, newToken: verify.newToken});
    }
});

router.post('/getAllShops', async (req,res)=>{
    let payload = req.body
    let verify = await accessToken(payload.token,payload.refresh);
    if (verify.status == 'fail') res.json({status: 'fail', message: 'Session Verification Failed'});
    else {
        let value = await mongo.Shops.getAllShops;
        res.json({status:'success', message: 'All open shops returned', shops: value, newToken: verify.newToken});
    }
});

router.post('/updateShop', async (req,res)=>{
    let payload = req.body
    let verify = await accessToken(payload.token,payload.refresh);
    if (verify.status == 'fail') res.json({status: 'fail', message: 'Session Verification Failed'});
    else {
        let value = await mongo.Shops.updateShop(payload.shop_id, verify.username,payload.change);
        if (!value){
            res.json({status:'fail', message:'Shop Update Failed', newToken: verify.newToken});
        }
        else{
            res.json({status:'success', message:'Shop Update Succeeded', newToken: verify.newToken});
        }
    }
});



module.exports = {
    router,

};