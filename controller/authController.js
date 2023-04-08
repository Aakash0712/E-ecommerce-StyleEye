const express = require('express');
const router = express.Router();
// const user = require('../models/userModels')
const multer = require('multer')
const alert = require('alert')
const userController = require('../controller/userController');
const {user, shop} = require('../models/userModels')
const {product} = require('../models/product')
const {cart , userAddress} = require("../models/oderModuls")
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
router.use(cookieParser());


const authUser = (req,res,next)=>{
            const cookieToken = req.cookies.token
            // const  varifytoken = jwt.varifytoken(cookietoken, process.env.Secret_Key);
            // const token = jwt.sign({seller:varifytoken._id , shop:shopdata._id},process.env.Secret_Key);
            jwt.verify(cookieToken, process.env.Secret_Key, (err, decoded) => {
                if (err) {
                  res.redirect("/login")
                } else {
                  // Token is valid, decoded contains the decoded token data
                  user.findById(decoded._id, {})
                  .then((data) => {
                    if (data.role == "user") {
                      next();
                    } else {
                      if (data.role == "seller") {
                        res.send("You Don't Access This Page");
                      }
                    }
                  })
                  .catch((err) => {
                    res.redirect("/login");
                  });
                }
              });
   
    

}


const authSeller = (req,res,next)=>{
    
    // const sellerid = req.cookies.user
    const cookietoken = req.cookies.token
    // const  varifytoken = jwt.varifytoken(cookietoken, process.env.Secret_Key)
    jwt.verify(cookietoken, process.env.Secret_Key, (err, decoded) => {
        if (err) {
         res.redirect("/seller/login")
        } else {
          // Token is valid, decoded contains the decoded token data
          const id = decoded._id
          user.findById(decoded._id,{})
          .then((data)=>{
              if(data.role == "seller"){
                  shop.findOne({
                    seller:id
                  })
                  .then((data)=>{
                    if(!data){
                      next()
                    }else{
                      res.status(404).send("you are alrady  registerd")
                    }
                  })
              }else{
                  if(data.role == "user"){
                      res.status(404).send("err")
                  console.log("err");
                  }
              }
          }).catch(err=>{
              res.status(404).send("err")
              console.log("err");
          })
        }
      });
    // const token = jwt.sign({seller:varifytoken._id , shop:shopdata._id},process.env.Secret_Key);

  
}


const authSellerWithShop = (req,res,next)=>{
    const cookieToken = req.cookies.token
    // const  varifytoken = jwt.varifytoken(cookietoken, process.env.Secret_Key);
    jwt.verify(cookieToken, process.env.Secret_Key, (err, decoded) => {
        if (err) {
          res.redirect("/seller/login")

        } else {
          // Token is valid, decoded contains the decoded token data
          user.findById(decoded._id,{})
                .then((sellerdata)=>{
                      if(sellerdata.role == "seller"){
                      shop.findById(decoded.shop,{})
                          .then((shopdata)=>{
            // console.log(shopdata.seller);
                              if(shopdata.seller == decoded._id){
                                       next()
                               }else{
                                   res.status(400).send("This is Bad Request!!")
                                   }
                           }).catch(err=>{
                                   res.redirect("/seller/shop/registration")
                           })
                     }else{
                          res.status(404).send("404 ERROR")
                           }

               }).catch(err=>{
                           res.status(404).send("404 ERROR")
               })
           }
      });
 
    
}



const authAddress =async (req,res,next)=>{
    const cookieToken = req.cookies.token
   
    jwt.verify(cookieToken, process.env.Secret_Key,async (err, decoded)=>{
        if(err){
          res.redirect("/login")

        }
        if(decoded){
        const addressmach = await userAddress.findOne({userId:decoded._id})
        if(!addressmach){
          next()

        }else{
          res.redirect("/cartpage")

        }
    }
    })
}




module.exports ={
    authUser,
    authSeller,
    authSellerWithShop,
    authAddress

}