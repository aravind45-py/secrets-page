require('dotenv').config()
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// for encrpytion of password
const encrypt = require('mongoose-encryption');

const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
mongoose.connect('mongodb://localhost:27017/userDb',{useNewUrlParser:true,useUnifiedTopology:true})
const schema = new mongoose.Schema({
    email:String,
    password:String
})

// encrypt should be added to schema object
// create a text with random words and add to secret key in plugin of schema
// for only particular fields use encryptedFields:[add fields]

schema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']})


const User = mongoose.model('User',schema);
app.get('/',function(request,response){
    response.render('home');
})
app.get('/login',function (request,response) { 
    response.render('login') 
})
app.get('/register',function (request,response) { 
    response.render('register') 
})
app.post('/register',function(request,response){
    const name = request.body.username;
    const password = request.body.password;
    const newuser = new User({
        email:name,
        password:password
    })
    newuser.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            response.render('secrets');
        }
    })
})

app.post('/login',function(request,response){
    User.findOne({email:request.body.username},function(err,docs){
        if(!err){
            if(docs){
                if(docs.password == request.body.password){
                response.render('secrets');}
            else{
                console.log("no match found");
            }
        }
        }
    })
})
app.listen(3000,function(){
    console.log('server started at 3000');
})