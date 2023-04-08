const express = require('express');
const router = express.Router();
const multer = require('multer')
const jwt = require('jsonwebtoken')
const alert = require('alert')
const userController = require('../controller/userController');
const authController = require('../controller/authController');
const {user, shop} = require('../models/userModels')
const {cart , userAddress, orderCancel} = require('../models/oderModuls')
const {product} = require('../models/product')
const cookieParser = require('cookie-parser')
require("dotenv").config();
router.use(cookieParser());

const shopRouter = (req,res,next)=>{
    const cookieToken = req.cookies.token
    jwt.verify(cookieToken, process.env.Secret_Key, (err, decoded) => {
        if (err) {
            console.log('token err',err);
            res.status(404)
        } else {
            const login = req.query.login;
          res.render("sellerShop",{
            sellerid : decoded._id,
            login
        })
        }
      });
   
}


const sellerDeshboardRouter = async(req,res,next)=>{
    const cookieToken = req.cookies.token
    jwt.verify(cookieToken, process.env.Secret_Key,async (err, decoded) => {
        if (err) {
           res.redirect("/seller/login")
        } else {
         
            user.findById(decoded._id,{})
            .then((data)=>{
                shop.findById(decoded.shop,{})
                .then((shopdata)=>{
                    product.find({
                        seller:data._id
                    })
                    .then((prodata)=>{
                      cart.find({
                        sellerId:decoded._id,
                        payment:"complete"
                      })
                      .then((cart)=>{
                         orderCancel.find({sellerId:decoded._id}).then((cancels)=>{

                             // console.log(cart);
                             const add = req.query.add
                        const login = req.query.login
                        const proUp = req.query.proUp
                        const prodelete = req.query.prodelete
                        const status = req.query.status;
                        const update = req.query.returnUpdate;
                          res.render("sellerDeshboard",{
                              seller:data,
                              shop:shopdata,
                              product:prodata,
                              cart,
                              add,
                              login,
                              proUp,
                              prodelete,
                              status,
                              cancels,
                              update,
                            })
                          })
                      })
                })

                })
            })
        }
      });
   
}






const SellerRegistration =(req,res,next)=>{
    res.render("sellerRegistration")
}



const SellerLogin = (req,res,next)=>{
    res.render("sellerlogin")
}


module.exports = {
    shopRouter,
    sellerDeshboardRouter,
    SellerRegistration,
    SellerLogin,
}