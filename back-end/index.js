const express = require('express');
const app = express();
const mongo = require('mongodb');
const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{console.log(`Server Listening on Port ${PORT}`)});
app.use(express.json({limit:'1mb'}));


app.post('/account/register',(req,res)=>{
    console.log('Register request recieved')

    let payload = req.body;
    console.log(payload);

    res.json({
        status: 'success',
        message: 'recieved register'
    })
});


app.post('/account/login',(req,res)=>{
    console.log('Login request recieved');

    let payload = req.body;
    console.log(payload);

    res.json({
        status: 'success',
        message: 'recieved login'
    })
});