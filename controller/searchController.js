const express = require('express');
const router = express.Router();
// const user = require('../models/userModels')
const multer = require('multer')
const alert = require('alert')
const userController = require('../controller/userController');
const {user, shop} = require('../models/userModels')
const {product, likeModel} = require('../models/product')
const {cart , userAddress} = require("../models/oderModuls")
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
router.use(cookieParser());


const search =async (req,res,next)=>{

    const searchTerm = req.query.q;
    // console.log(searchTerm);
if(searchTerm == undefined){
    next()
}else{
    if(searchTerm == ""){
        next()
    }else{
       await product.find({
            $or: [
              { productName: { $regex: searchTerm, $options: 'i' } },
              { brand: { $regex: searchTerm, $options: 'i' } },
              { category: { $regex: searchTerm, $options: 'i' } },
              { "variants.variantscolor": { $regex: searchTerm, $options: 'i' } },
              { "variants.variantsSize": { $regex: searchTerm, $options: 'i' } },
             ]
          }).then(products => {
            // Do something with the products
            // console.log(products);
            const cookieToken = req.cookies.token
            jwt.verify(cookieToken, process.env.Secret_Key, async(err, decoded) => {
            if(err){return res.render("searchData",{
                loginuser:true,
                products,
                like:[],
            })}else{
                const like = await likeModel.find({userId:decoded._id})
                return res.render("searchData",{
                    loginuser:true,
                    products,
                    like,
                })
            
            }
        })        
          })
          .catch(error => {
            // Handle the error     
            console.log(error);
          });
    }
}
}

module.exports = {
    search
}