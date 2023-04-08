const express = require('express');
const router = express.Router();
const multer = require('multer')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const alert = require('alert')
const userController = require('../controller/userController');
const authController = require('../controller/authController');
const {search} = require('../controller/searchController');
const {user, shop} = require('../models/userModels')
const {rate} = require('../models/productRatingOrModel')

const {cart , userAddress, orderCancel} = require('../models/oderModuls')
const {product, likeModel} = require('../models/product')
const cookieParser = require('cookie-parser')
router.use(cookieParser());
const getController = require("../controller/getController");
const bcrypt = require("bcryptjs");
// const pdf = require('html-pdf');
// const fs = require('fs');



router.get('/home',search,getController.getHome)


router.get("/login",getController.getLoginPage)





// router.get("/product",(req,res)=>{
//     res.render("product")
// })









router.get("/sunglasses",search,getController.getSunglasses)


router.get("/computerglasses",search,getController.getComputerGlasses)


router.get("/powerglasses",search,getController.getPowerGlasses)


router.get("/contactlenses",search,getController.getContactLens)


router.get("/aboutpage",search,getController.getAbout)


router.get("/single/product/:id",search,getController.getSingleProductPage)


router.get("/cartpage",search,authController.authUser,getController.getCartPage)




// router.get("/user/addtocart",(req,res,next)=>{
//     res.send("product add on cart and donne allll")
// })



router.get("/user/address",search,authController.authAddress,getController.getUserAddressPage)


router.get("/cart/product/delete/:id",getController.getCartProductDelete)



router.get("/user/oders/track",search,getController.getOdersTrack)



router.get("/product/rating/:id",search,(req,res,next)=>{
  
    const cookieToken = req.cookies.token
    jwt.verify(cookieToken, process.env.Secret_Key, async(err, decoded) => {
      if(err){res.redirect("/login")}else{
        const dateTime = require('node-datetime')
        
        const like = await likeModel.findOne({productId:req.params.id})
        product.findById(req.params.id,{})
        .then((data)=>{
            user.findById(decoded._id)
            .then((user)=>{
                      const dt = dateTime.create();
                      const date = dt.format('d-m-Y');
                        res.render("productRating",{
                            pro:data,
                            user,
                            date,
                            loginuser:true,
                            like,
                        })
                    })
            })
          }
    })
})






router.get("/user/rating/product/:id",search,(req,res,next)=>{
 
  const cookieToken = req.cookies.token
    jwt.verify(cookieToken, process.env.Secret_Key, async(err, decoded) => {
    if(err){res.redirect("/login")}else{

      rate.find({
          productid:req.params.id
      })
      .then((data)=>{
        user.findById(data.userid)
        .then((user)=>{
            product.findById(req.params.id)
            .then((pro)=>{
              
              rate.find({ productid: req.params.id }, (err, docs) => {
                if (err) {
                  console.log(err);
                } else {
                  const numReviews = docs.length;
                  let totalRating = 0;
                  for (let i = 0; i < numReviews; i++) {
                    totalRating += docs[i].rate;
                  }
                  const averageRating = (totalRating / numReviews).toFixed(1);
                  const realrate = Math.floor(averageRating * 2)/2
                  res.render("ratePageProduct",{
                    loginuser:true,
                    data,
                    user,
                    pro,
                    realrate,
                  })
                }
              });

          })
        })
      })
    }
    })
})

rate.find({ productid:"64102c65440bbbcf344b74ed" }, (err, docs) => {
  if (err) {
    console.log(err);
  } else {
    const numReviews = docs.length;
    let totalRating = 0;
    for (let i = 0; i < numReviews; i++) {
      totalRating += docs[i].rate;
    }
    const averageRating = (totalRating / numReviews).toFixed(1);
    const realrate = Math.floor(averageRating * 2)/2
    console.log(realrate);
  }

})
    

router.get(`/categorys/:opsion1/:opsion2/:category`,(req,res,next)=>{
    // console.log(req.params.category);
    // console.log(req.params.opsion1);
    // console.log(req.params.opsion2);
    const category = req.params.category
    const opsion2 = req.params.opsion2
    const opsion1 = req.params.opsion1
    if(opsion1 == "low"){

        product.find({
            category:category
        }).then((products)=>{
    
            const lala = products.sort((a, b) => {
                // Find the lowest price among all variants for each product
                const aLowestPrice = a.variants.reduce((min, variant) => {
                  return variant.variantsPrice < min ? variant.variantsPrice : min;
                }, Infinity);
                const bLowestPrice = b.variants.reduce((min, variant) => {
                  return variant.variantsPrice < min ? variant.variantsPrice : min;
                }, Infinity);
            
                // Sort by lowest price
                return aLowestPrice - bLowestPrice  ;
              });
              const cookieToken = req.cookies.token
              jwt.verify(cookieToken, process.env.Secret_Key, async(err, decoded) => {
              if(err){ res.render("categorys",{
                product : lala,
                category,
                loginuser:true,
                like:[]
              })}else{
                const like = await likeModel.find({userId:decoded._id})
                res.render("categorys",{
                  product : lala,
                  category,
                  loginuser:true,
                  like,
                })
              }
            })          
        })
    }else if(opsion1 == "high"){
        
        product.find({
            category:category
        }).then((products)=>{
    
            const lala = products.sort((a, b) => {
                // Find the lowest price among all variants for each product
                const aLowestPrice = a.variants.reduce((min, variant) => {
                  return variant.variantsPrice < min ? variant.variantsPrice : min;
                }, Infinity);
                const bLowestPrice = b.variants.reduce((min, variant) => {
                  return variant.variantsPrice < min ? variant.variantsPrice : min;
                }, Infinity);
            
                // Sort by lowest price
                return  bLowestPrice - aLowestPrice ;
              });
              const cookieToken = req.cookies.token
              jwt.verify(cookieToken, process.env.Secret_Key, async(err, decoded) => {
              if(err){ res.render("categorys",{
                product : lala,
                category,
                loginuser:false,
                like:[],
              })}else{
                const like = await likeModel.find({userId:decoded._id})
                res.render("categorys",{
                  product : lala,
                  category,
                  loginuser:true,
                  like,
                })
              }
            })          
        })
    }    
    else if(opsion1 == 0 || opsion1 == 1500 || opsion1 == 2000 || opsion1 == 3000){
        const num1 = Number(opsion1)
        const num2 = Number(opsion2)

        product.find({ category: category }).then((products) => {
            const filteredProducts = products
              .filter((product) => {
                // Filter products by checking if at least one variant has a price within the range of 0 to 20
                return product.variants.some(
                  (variant) => variant.variantsPrice >= num1 && variant.variantsPrice <= num2
                );
              })
              .sort((a, b) => {
                // Sort products by their lowest variant price within the range of 0 to 20
                const aLowestPrice = a.variants.reduce((min, variant) => {
                  if (variant.variantsPrice >= num1 && variant.variantsPrice <= num2) {
                    return variant.variantsPrice < min ? variant.variantsPrice : min;
                  }
                  return min;
                }, Infinity);
                const bLowestPrice = b.variants.reduce((min, variant) => {
                  if (variant.variantsPrice >= num1 && variant.variantsPrice <= num2) {
                    return variant.variantsPrice < min ? variant.variantsPrice : min;
                  }
                  return min;
                }, Infinity);
          
                return aLowestPrice - bLowestPrice;
              });
              const cookieToken = req.cookies.token
              jwt.verify(cookieToken, process.env.Secret_Key, async(err, decoded) => {
              if(err){res.render("categorys",{
                product : filteredProducts,
                category,
                loginuser:true,
                like:[]
              })}else{
                const like = await likeModel.find({userId:decoded._id})
                res.render("categorys",{
                  product : filteredProducts,
                  category,
                  loginuser:true,
                  like,
                })
              }
            })          
          });
        
    }
    else if(opsion1 == "luxury"){

        product.find({ category: category }).then((products) => {
            const filteredProducts = products
              .filter((product) => {
                // Filter products by checking if at least one variant has a price within the range of 0 to 20
                return product.variants.some(
                  (variant) => variant.variantsPrice >= 5100 && variant.variantsPrice <= 15000
                );
              })
              .sort((a, b) => {
                // Sort products by their lowest variant price within the range of 0 to 20
                const aLowestPrice = a.variants.reduce((min, variant) => {
                  if (variant.variantsPrice >= 5100 && variant.variantsPrice <= 15000) {
                    return variant.variantsPrice < min ? variant.variantsPrice : min;
                  }
                  return min;
                }, Infinity);
                const bLowestPrice = b.variants.reduce((min, variant) => {
                  if (variant.variantsPrice >= 5100 && variant.variantsPrice <= 15000) {
                    return variant.variantsPrice < min ? variant.variantsPrice : min;
                  }
                  return min;
                }, Infinity);
          
                return aLowestPrice - bLowestPrice;
              });
              const cookieToken = req.cookies.token
              jwt.verify(cookieToken, process.env.Secret_Key, async(err, decoded) => {
              if(err){  res.render("categorys",{
                product : filteredProducts,
                category,
                loginuser:true,
                like:[]
              })}else{
                const like = await likeModel.find({userId:decoded._id})
                res.render("categorys",{
                  product : filteredProducts,
                  category,
                  loginuser:true,
                  like,
                })
              }
            })          
          });
        
    }
    else if(opsion2 == "large"){
        product.find({ category: category, 'variants.variantsSize': "large" })
        .then((data)=>{
          const cookieToken = req.cookies.token
          jwt.verify(cookieToken, process.env.Secret_Key, async(err, decoded) => {
          if(err){ res.render("categorys",{
            product : data,
            category,
            loginuser:true,
            like:[]
          })}else{
            const like = await likeModel.find({userId:decoded._id})
            res.render("categorys",{
              product : data,
              category,
              loginuser:true,
              like,
            })
          }})      
        }).catch(err=>{console.log(err);})
    }
    else if(opsion2 == "medium"){
        product.find({ category: category, 'variants.variantsSize': "Medium" })
        .then((data)=>{
          const cookieToken = req.cookies.token
          jwt.verify(cookieToken, process.env.Secret_Key, async(err, decoded) => {
          if(err){
            res.render("categorys",{
              product : data,
              category,
              loginuser:true,
              like:[]
            })}else{
              const like = await likeModel.find({userId:decoded._id})
              res.render("categorys",{
                product : data,
                category,
                loginuser:true,
                like,
              })
            }})      
        }).catch(err=>{console.log(err);})
    }
    else if(opsion2 == "small"){
        product.find({ category: category, 'variants.variantsSize': "Small" })
        .then((data)=>{
          const cookieToken = req.cookies.token
          jwt.verify(cookieToken, process.env.Secret_Key, async(err, decoded) => {
          if(err){
            res.render("categorys",{
            product : data,
            category,
            loginuser:true,
            like:[]
          })}else{
            const like = await likeModel.find({userId:decoded._id})
            res.render("categorys",{
                product : data,
                category,
                loginuser:true,
                like,
              })
            }
          })      
        }).catch(err=>{console.log(err);})
    }


   
})



router.get("/user/logout",(req,res,next)=>{
  try {
    
    res.clearCookie("token")
  } catch (error) {
    console.log(error);
  }
  const logout = true
  res.redirect("/home?logout="+ logout)

})


router.get("/user/profile",async (req,res,next)=>{
  const cookieToken = req.cookies.token
    jwt.verify(cookieToken, process.env.Secret_Key,async (err, decoded)=>{
    if(err){

  res.redirect("/login")
    }else{
      const userdata = await user.findById(decoded._id,{})
      const addressdata =await userAddress.findOne({userId:decoded._id})
      if(addressdata == null){
        if(userdata.role == "seller"){
            res.redirect(`/seller/account/${decoded._id}`)
        }else{
        console.log(decoded._id);
        res.redirect("/user/address")
        }
      }else{
   
        return res.render("userProfile",{
          loginuser:true,
          addressdata,
          userdata,
          update:req.query.done
        })
      }
      
    }
    })
})





router.get("/user/forgot/password",(req,res,next)=>{
  const wrong = req.query.wrongemail
  // console.log(wrong);
  res.render("forgotPassword",{wrong})
})


router.get("/seller/forgot/password",(req,res,next)=>{
  const wrong = req.query.wrongemail
  // console.log(wrong);
  res.render("sellerForgotPassword",{wrong})
})



router.get("/:users/forgot/vrify/:email",async(req,res,next)=>{
  console.log();
  const users = req.params.users;
  const otp = req.query.otp;
  const email = req.params.email;
  // const machotp = bcrypt.compare()
  console.log(otp);
  console.log(email);
  res.render("otpVrify",{users,otp,email})
  
})




router.get("/:user/change/password/:id",async(req,res,next)=>{
    const id = req.params.id;
    const user = req.params.user;
    if(user == "user" || user == "seller"){
        res.render("changePassword",{id})
    }else{
      res.status(404)
    }
})





router.get("/user/Order/cancel/:id",async(req,res,next)=>{
  const oderdata = await cart.findById(req.params.id)

  res.render("oderCancelForm",{oderdata})

})



router.get("/cancel/orders",async(req,res,next)=>{
  const cookieToken = req.cookies.token
  jwt.verify(cookieToken, process.env.Secret_Key,async (err, decoded)=>{
  if(err){
    res.redirect("/login")
  }else{
    const cancel = await orderCancel.find({
      userId:decoded._id
    })
    res.render("viewCancelOrder",{product:cancel,loginuser:true})
    // console.log(cancel);
  }
})
})


const puppeteer = require('puppeteer');
const pdf = require('html-pdf-node');
const ejs = require('ejs');
const fs = require('fs');


router.get('/bill/download/:id', async (req, res) => {
  const cookieToken = req.cookies.token
    jwt.verify(cookieToken, process.env.Secret_Key,async (err, decoded)=>{
    if(err){
      res.redirect("/login")
    }else{
      const userdata = await user.findById(decoded._id);
      const billdata = await orderCancel.findById(req.params.id)
      const address = await userAddress.findOne({userId:decoded._id})
 
      if(userdata.role == "seller"){
        res.status(404);
      }else{
        
        const dateTime = require('node-datetime')
        const dt = dateTime.create();
        const date = dt.format('d-m-Y');
        const html = await ejs.renderFile('./views/cancelBillGenerate.ejs' ,{userdata,billdata,address,date});

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html);
        const pdfBuffer = await page.pdf({ format: 'A4' });
        await browser.close();
      
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=cancelBill${date}.pdf`);
        res.send(pdfBuffer);
              
      }
    }
  })
});





router.get('/order/bill/download/:id', async (req, res) => {
  const cookieToken = req.cookies.token
    jwt.verify(cookieToken, process.env.Secret_Key,async (err, decoded)=>{
    if(err){
      res.redirect("/login")
    }else{
      const userdata = await user.findById(decoded._id);
      const billdata = await cart.findById(req.params.id)
      const address = await userAddress.findOne({userId:decoded._id})
 
      if(userdata.role == "seller"){
        res.status(404);
      }else{
        
        const dateTime = require('node-datetime')
        const dt = dateTime.create();
        const date = dt.format('d-m-Y');
        const html = await ejs.renderFile('./views/billGenerate.ejs' ,{userdata,billdata,address,date});

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html);
        const pdfBuffer = await page.pdf({ format: 'A4' });
        await browser.close();
      
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=orderBill${date}.pdf`);
        res.send(pdfBuffer);
              
      }
    }
  })
});



router.get("/user/product/like/:id",async(req,res,next)=>{
  const cookieToken = req.cookies.token
  jwt.verify(cookieToken, process.env.Secret_Key,async (err, decoded)=>{
  if(err){
    res.redirect("/login")
  }else{
    const userdata = await user.findById(decoded._id)
    if(userdata.role == "seller"){
      res.redirect('back');
    }else{

      const likedata = new likeModel({
        productId:req.params.id,
        userId:decoded._id,
        like:true
      })
      likedata.save(err=>{
      if(err){
        console.log("some problem"+ err);
      }else{
        console.log("like data save");
        res.redirect('back');
      }
      
    })
  }
  }
})
})



router.get("/user/product/dislike/:id",async(req,res,next)=>{
  const hello =  await likeModel.findByIdAndDelete(req.params.id)
  // console.log(hello);
  res.redirect('back');

})



router.get("/user/liked/products",async(req,res,next)=>{
  const cookieToken = req.cookies.token
  jwt.verify(cookieToken, process.env.Secret_Key,async (err, decoded)=>{
  if(err){
    res.redirect("/login")
  }else{
    const like = await likeModel.find({userId:decoded._id})
    const products = await product.find({})

    res.render("likePage" ,{like,products,loginuser:true,})
  }
})
})




router.get("/user/feedback",async(req,res,next)=>{
  const cookieToken = req.cookies.token
  jwt.verify(cookieToken, process.env.Secret_Key,async (err, decoded)=>{
  if(err){
    res.redirect("/login")
  }else{
    const id = decoded._id;
    res.render("feedbackForm",{id})
  }
})
})




module.exports = router;