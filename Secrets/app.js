//jshint esversion:6
require('dotenv').config();
const express=require('express');
const body=require('body-parser');
const app=express();
const ejs=require('ejs');
const mongoose=require('mongoose');
const encrypt=require('mongoose-encryption');
app.use(body.urlencoded({extended:true}));
app.use('/public',express.static('public'));
app.set('view engine','ejs');
mongoose.connect("mongodb://127.0.0.1:27017/secretsDB",{
    useNewUrlParser:true,
    useUnifiedTopology:true
});
const db=mongoose.connection;
db.on('error',console.error.bind(console,"Connection Error"));
db.on('open',()=>{
    console.log("Database Connected Successfully");
})

const SecretSchema=new mongoose.Schema({
    email:String,
    passwd:String
})

SecretSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['passwd']});
const Secret=mongoose.model('secrets',SecretSchema);


app.get("/",function(req,res){
    res.render("home")
})
app.get("/login",function(req,res){
    res.render("login");
})
app.get("/register",function(req,res){
    res.render("register");
})
app.post("/register",function(req,res){
    const sec=new Secret({
        email:req.body.username,
        passwd:req.body.password
    });
    sec.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.render("secrets");
        }
    });
})
app.post("/login",function(req,res){
    Secret.findOne({email:req.body.username},function(err,found){
        if(err){
            console.log(err);
        }
        else{
            if(found){
                if(found.passwd === req.body.password){
                    res.render("secrets");
                }
            }
        }
    })
})

app.listen(3000,function(){
    console.log("Server 3000 connected");
})