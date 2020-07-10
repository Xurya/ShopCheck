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

    //Check payload:
    let response = checkPayload('register', payload);

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

    let payload = req.body;
    console.log(payload);

    res.json({
        status: 'success',
        message: 'recieved login'
    }) 
});

function checkPayload(type, payload){
    //Multipurposing for both login and registration
    parsed = JSON.parse(payload);

    //Object.length is not applicable for JSON, so manually count.
    var count=0;
    for(var prop in obj) {
       if (obj.hasOwnProperty(prop) && obj.prop != null && obj.prop != '') {
          count++;
       }
    }

    //Type Specific Rules
    if(type=='register'){
        if (count != 3){
            return 'Required fields cannot be empty or null';
        } else if (!obj.email.includes('@')) {
            return 'Email must contain an @';
        }
    }else if(type=='login'){
        if (count != 2){
            return 'Required fields cannot be empty or null';
        } 
    }

    //Overlapping Rules
    if(obj.username.length < 6){
        return 'Username cannot have less than 6 characters';
    }  else if (obj.password.length < 6){
        return 'Password cannot have less than 6 characters';
    } else if (obj.password.includes('<') || password.includes('>')) {
        return 'Password cannot contain tags (less than or greater than signs)';
    }

    //TODO: Check for database conflicts.

    return 'success';
}