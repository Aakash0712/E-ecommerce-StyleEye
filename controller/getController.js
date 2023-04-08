const express = require('express');
const router = express.Router();
const multer = require('multer')
const jwt = require('jsonwebtoken')
const alert = require('alert')
const userController = require('../controller/userController');
const authController = require('../controller/authController');
const {rate} = require('../models/productRatingOrModel')
const {user, shop} = require('../models/userModels')
const {cart , userAddress} = require('../models/oderModuls')
const {product, likeModel} = require('../models/product')
const cookieParser = require('cookie-parser')
router.use(cookieParser());

const shopGetRouter = (req,res,next)=>{
    const cookieToken = req.cookies.token
    jwt.verify(cookieToken, process.env.Secret_Key, (err, decoded) => {
        if (err) {
           res.redirect("/seller/login")
        } else {
            const login = req.query.login;
          res.render("sellerShop",{
            sellerid : decoded._id,
            login
        })
        }
      });
   
}


const sellerDeshboardGetRouter = (req,res,next)=>{
    const cookieToken = req.cookies.token
    jwt.verify(cookieToken, process.env.Secret_Key, (err, decoded) => {
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
                        // console.log(cart);
                        const add = req.query.add
                        const login = req.query.login
                          res.render("sellerDeshboard",{
                              seller:data,
                              shop:shopdata,
                              product:prodata,
                              cart,
                              add,
                              login,

                          })
                      })
                })

                })
            })
        }
      });
   
}



const getSunglasses =async (req,res,next)=>{

    const data =await product.find({category:"sunglasses"})
    
    // console.log(like);
    const cookieToken = req.cookies.token
    jwt.verify(cookieToken, process.env.Secret_Key,async (err, decoded)=>{
        if (err) {
            res.render("sunglasses",{
                sun:data,
                user:"",
                loginuser:false,
                like:[],
            })
        } else {
            const like = await likeModel.find({userId:decoded._id})
            res.render("sunglasses",{
                sun:data,
                user:decoded._id,
                loginuser:true,
                like,
            })
            
        }
    })
}


const getComputerGlasses =async (req,res,next)=>{
    const data = await product.find({category:"computerglasses"})
    
    const cookieToken = req.cookies.token
    jwt.verify(cookieToken, process.env.Secret_Key, async(err, decoded)=>{
        if (err) {
            res.render("computerGlasses",{
                comp:data,
                user:"",
                loginuser:false,
                like:[],

            })
        } else {
            const like = await likeModel.find({userId:decoded._id})
            res.render("computerGlasses",{
                comp:data,
                user:decoded._id,
                loginuser:true,
                like,
            })
        }
    })
       
   
}


const getPowerGlasses =async (req,res,next)=>{
    const data =await product.find({category:"powerglasses"})
    
    const cookieToken = req.cookies.token
    jwt.verify(cookieToken, process.env.Secret_Key, async(err, decoded)=>{
        if (err) {
            res.render("powerGlasses",{
                power:data,
                user:"",
                loginuser:false,
                like:[],
            })  
        } else {
            const like = await likeModel.find({userId:decoded._id})
            res.render("powerGlasses",{
                power:data,
                user:decoded._id,
                loginuser:true,
                like,
            })  
        }
    })
        
}



const getContactLens =async (req,res,next)=>{

     const data =await product.find({category:"contactlens"})
     const cookieToken = req.cookies.token
     jwt.verify(cookieToken, process.env.Secret_Key, async(err, decoded)=>{
         if (err) {
            res.render("contactlens",{
                contact:data,
                user:"",
                loginuser:false,
                like:[],
            })
         } else {
            const like = await likeModel.find({userId:decoded._id})
            res.render("contactlens",{
                contact:data,
                user:decoded._id,
                loginuser:true,
                like,
            })
         }
     })
       
}


const getAbout = (req,res,next)=>{
    const cookieToken = req.cookies.token
    jwt.verify(cookieToken, process.env.Secret_Key, (err, decoded)=>{
        if (err) {
            res.render("about",{
                user:"",
                loginuser:false

            })
            
        } else {
            res.render("about",{
                user:decoded._id,
                loginuser:true
            })
        }
    })
}



const getSingleProductPage = async (req,res,next)=>{
    
    product.findById(req.params.id,{})
    .then((data)=>{
        user.findById(data.seller,{})
        .then((seller)=>{
            shop.findOne({
                seller:seller._id
            })
            .then((shop)=>{
                const cookieToken = req.cookies.token
    jwt.verify(cookieToken, process.env.Secret_Key,async (err, decoded)=>{
        if(err){
            const cart = req.query.cart
            res.redirect("/login")
        }else{
            const lastTwoWords = data.productName.split(' ').slice(-1).join(' ');
            const releted = await product.find({
                $or: [
                  { productName: { $regex: lastTwoWords, $options: 'i' } },
                  { category: { $regex: data.category, $options: 'i' } },
                 ]
              })
            //   const first = releted.slice(2, 5);
            //   const second = releted.slice(5, 8);
            //   const theerd = releted.slice(1, 12);
            //   console.log(releted );
             const like = await likeModel.find({userId:decoded._id})
            const cart = req.query.cart
            const limit = req.query.limit
            const sellermach = req.query.seller
            const datadata = data.productName
            res.render("singleProduct",{
                product:data,
                shop,
                seller,
                user:decoded._id,
                cart,
                loginuser:true,
                limit,
                sellermach,
                releted,
                datadata,
                like,
            })
        }
               
            })
        })
    })
        
})
    
}

require("dotenv").config();



const getCartPage = (req,res,next)=>{
    const pdelete = req.query.pdelete;
    // console.log(pdelete);
    const cookieToken = req.cookies.token
    jwt.verify(cookieToken, process.env.Secret_Key, (err, decoded)=>{
   if(err){res.redirect("/login")}else{
        cart.find({userId:decoded._id , payment:"pending"})
        .then((data)=>{
        
                userAddress.find({
                    userId:decoded._id
                })
                .then((address)=>{
                    user.findById(decoded._id)
                    .then((user)=>{
                        if(err){
                            res.render("/login")
                        }else{
                            if(address == ""){
                               
                                res.render("cartPage",{
                                    cart:data,
                                    address,
                                    key:process.env.PUBLISHABLE_KEY,
                                    user,
                                    pdelete,
                                    loginuser:true,
                                    machdata:false,
                                    
                                })
                            }else{
                               

                                const machdata = true
                                res.render("cartPage",{
                                    cart:data,
                                    address,
                                    key:process.env.PUBLISHABLE_KEY,
                                    user,
                                    pdelete,
                                    loginuser:true,
                                    machdata,
                                    
                                })
                            }
                       
    }

                    })
                })
           
        })
    }
    })
}


const getUserAddressPage =(req,res,next)=>{
    const cookieToken = req.cookies.token
    jwt.verify(cookieToken, process.env.Secret_Key, (err, decoded)=>{
if(err){res.redirect("/login")}else{
        res.render("userAddress",{
            user:decoded._id,
            loginuser:true
        })
    }
    })
}



const getCartProductDelete =async (req,res,next)=>{
    const id = req.params.id
    await cart.findByIdAndDelete(id,{})
    const pdelete = "yes";
    return res.redirect("/cartpage?pdelete=" + pdelete)
}

const getHome =async (req,res,next)=>{
    const products = await product.find({})
    const contact = await product.find({category:"contactlens"})
    const computer = await product.find({category:"computerglasses"})
    const sun = await product.find({category:"sunglasses"})
    const power = await product.find({category:"powerglasses"})
    // const products = await product.find({})
    const slicedProducts = products.slice(5, 8);
    const contactdata = contact.slice(0, 3);
    const computerProducts = computer.slice(3, 4);
    const powerProducts = power.slice(5, 6);
    const sunProducts = sun.slice(5, 6);
    const productIds = slicedProducts.map(doc => doc._id.toString());
    // console.log(productIds);
    const threeReating = await rate.find({productid:productIds})
    // console.log(reating);
    const cookieToken = req.cookies.token
    jwt.verify(cookieToken, process.env.Secret_Key, (err, decoded)=>{
        if(err){
        const logout = req.query.logout
            res.render('home',{
                mess : "",
                products: slicedProducts,
                user:"",
                login:false,
                loginuser:false,
                logout,
                computerProducts,
                powerProducts,
                sunProducts,
                contactdata,
                threeReating,
            })
        }else{
        const mess = req.query.login
        const logout = req.query.logout
        res.render('home',{
             mess,
             products: slicedProducts,
            user:decoded._id,
            login:true,
            loginuser:true,
            logout,
            computerProducts,
            powerProducts,
            sunProducts,
            contactdata,
            threeReating,
         })
}
})
}


const getLoginPage = (req,res,next)=>{
    const pass = req.query.pass
    const email = req.query.email
    res.render('loginUser',{
        email,
        pass,
    })
} 


const getSellerRegistration =(req,res,next)=>{
    res.render("sellerRegistration")
}



const getSellerLogin = (req,res,next)=>{
    res.render("sellerlogin")
}


const getOdersTrack =(req,res,next)=>{
    const cookieToken = req.cookies.token
    jwt.verify(cookieToken, process.env.Secret_Key, (err, decoded)=>{
        if(err){res.redirect("/login")}else{
        cart.find({userId:decoded._id, payment:"complete"})
        .then((data)=>{
            console.log(data);
            res.render("userOder",{
                product:data,
                loginuser:true
            })
        })
    }
    })
}




module.exports = {
    shopGetRouter,
    sellerDeshboardGetRouter,
    getSunglasses,
    getComputerGlasses,
    getPowerGlasses,
    getContactLens,
    getAbout,
    getSingleProductPage,
    getCartPage,
    getUserAddressPage,
    getCartProductDelete,
    getHome,
    getLoginPage,
    getSellerRegistration,
    getSellerLogin,
    getOdersTrack,
}