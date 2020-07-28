const Router = require('express-promise-router');
const { Console } = require('console');
const router = new Router();

router.post('/add', async (req,res)=>{
    console.log("Add Order Request Recieved");

    let payload = req.body;

    //Verify Auth Token

    //Add new order to mongo/order.js and respond with success or failure
});


router.post('/query', async (req,res)=>{
    console.log("Query Order Request Recieved");

    let payload = req.body;

    //Verify Auth Token

    //Send query to mongo/order.js and respond with content
});


router.post('/get', async (req,res)=>{
    console.log("Get Orders Request Recieved");

    let payload = req.body;

    //Verify Auth Token

    //Send username to mongo/order.js and respond with content
});

router.post('/update', async (req,res)=>{
    console.log("Update Order Request Recieved");

    let payload = req.body;

    //Verify Auth Token

    //Update database using mongo/order.js and respond with success/failure
});

module.exports = router;