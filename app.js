const userRouter = require('./router/userRouter')
const commonGetRouter = require('./router/commonGetRouter')
const admin = require('./router/adminRouter')
const seller = require('./router/sellerRouter')
const http = require('http');
const reload = require('reload')
const bodyParser = require('body-parser');
const express = require('express');
const Chart = require('chart.js')
const app = express();
require("dotenv").config();
// console.log(process.env.Secret_Key);

const path = require('path');
const fs = require('fs');

app.use(bodyParser.urlencoded({
    extended:true
}))
app.use(bodyParser.json());

app.set("view engine","ejs");
app.use(express.static('public'))

//DATABASE CONNECTION
const mongoose = require('mongoose');
const mongodb = 'mongodb+srv://aakashmaurya0712:aakashmaurya@cluster0.ifkiv6y.mongodb.net/styleeye?retryWrites=true&w=majority';
mongoose.set('strictQuery', false);
mongoose.connect(mongodb,{useNewUrlParser:true},(err)=>{
    if(!err){
        console.log("// * MONGODB DATABASE CONNECTED : StyleEye * //")
    }else{
        console.log(err)
    }
})

app.use('/',commonGetRouter,userRouter,admin,seller)
app.get("*",(req,res)=>{
    res.render("404Page")
})




try {
    const server = http.createServer(app);
    const port = 3000;
    server.listen(port)
    console.log("// * YOUR SERVER A RUN IN : 3000 * //")
} catch (error) {
    console.log(error)
}
reload(app);