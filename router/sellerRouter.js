const express = require('express');
const router = express.Router();
const multer = require('multer')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const alert = require('alert')
const userController = require('../controller/userController');
const sellerController = require('../controller/sellerController');
const authController = require('../controller/authController');
const {search} = require('../controller/searchController');
const {user, shop} = require('../models/userModels')
const {cart , userAddress, orderCancel} = require('../models/oderModuls')
const {product} = require('../models/product')
const cookieParser = require('cookie-parser')
router.use(cookieParser());
const getController = require("../controller/getController")

//This is seller get all router

router.get("/seller/registration",sellerController.SellerRegistration)



router.get("/seller/login",sellerController.SellerLogin)


router.get("/seller/shop/registration",authController.authSeller,sellerController.shopRouter)



router.get("/seller/deshboard",authController.authSellerWithShop,sellerController.sellerDeshboardRouter)




//new product entry that genraet date / and rendom  variant name/id
const dateTime = require('node-datetime');
const { rate } = require('../models/productRatingOrModel');
var dt = dateTime.create();
var date = dt.format('Y-m-d');
const rendom =  dt.format('d')
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
var randamring = generateString(10)
var variid = Math.floor( Math.random() * 9999 + rendom )



router.get("/seller/new/product",authController.authSellerWithShop,(req,res,next)=>{
    const cookieToken = req.cookies.token
    jwt.verify(cookieToken, process.env.Secret_Key, (err, decoded) => {
        if (err) {
            // console.log('token err',err);
          res.redirect("/seller/login")
        } else {
            user.findById(decoded._id,{})
            .then((data)=>{
                shop.findById(decoded.shop,{})
                .then((shopdata)=>{
                   // console.log(data);
                    res.render("sellerNewProduct",{
                        seller:data,
                        shop:shopdata,
                        variantid:variid,
                        variantname:randamring,
                    })
                })
            })
        }
      });
})






router.get("/seller/account/:id",(req,res,next)=>{
  const cookieToken = req.cookies.token
  jwt.verify(cookieToken, process.env.Secret_Key, async(err, decoded) => {
    if(err){
      res.redirect("/seller/login")
    }else{

      const id = decoded._id
      user.findById(id,{})
    .then((seller)=>{
        shop.findOne({
            seller:id
        })
        .then((shop)=>{
            const update = req.query.update
            res.render("sellerAccount",{
                seller,
                shop,
                update,
            })
        })
    })    
  }
  })
  })
  


router.get("/seller/product/view",async(req,res,next)=>{
  const cookieToken = req.cookies.token
    jwt.verify(cookieToken, process.env.Secret_Key, async(err, decoded) => {
      if(err){
        res.redirect("/seller/login")
      }else{
        const products = await product.find({seller:decoded._id})
        const sellerdetail = await user.findById(decoded._id)
        // console.log(products);
     res.render("sellerProductView",{
      products,
      seller:sellerdetail,
     })
      }
    })
    })




router.get("/seller/product/edit/:id",async(req,res,next)=>{
  const cookieToken = req.cookies.token
    jwt.verify(cookieToken, process.env.Secret_Key, async(err, decoded) => {
      if(err){
        res.redirect("/seller/login")
      }else{
        const seller = await user.findById(decoded._id)
        const peoductdetail =await product.findById(req.params.id) 

        res.render("sellerProductEdit",{
          seller,
          product:peoductdetail,

        })
      }
    
    
    })  
})

router.get("/seller/product/delete/:id",async(req,res,next)=>{
  
 await product.findByIdAndDelete(req.params.id)
  .then((data)=>{
    // console.log(data);
    const prodelete = true;
    return res.redirect("/seller/deshboard?prodelete=" + prodelete)
  
  }).catch(err=>{console.log(err);})
 
})



// this start all seller post router



router.post("/seller/edit/product/:id",async(req,res,next)=>{
 
  const vari = {
    variantId:req.body.varId,
    variantsName: req.body.vName,
    variantsDes: req.body.vDes,
    variantsSku: req.body.vSku,
    variantsPrice: req.body.vPrice,
    variantscolor: req.body.vcolor,
    variantsSize: req.body.vSize,
  };
  
  const datachange = await product.updateOne(
    { _id: req.params.id, 'variants._id': req.body.vId },
    { $set: { 'variants.$': vari, productName: req.body.productName, brand: req.body.brand, category: req.body.category, productDes: req.body.productDes
  } }
  ).then(result => console.log(result)).catch(error => console.log(error));
    
  const updatedProduct = await product.findById(req.params.id);
  console.log(updatedProduct.variants);
    const proUp = true;
  res.redirect("/seller/deshboard?proUp="+ proUp)
  
  })



router.post("/seller/Registration",userController.userRegistration)


router.post("/seller/shop/registration",userController.shopRegistration)




//THIS IS MULTER STORAGE AND FILR NAME CREATE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uplode');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });
  


router.post('/product', upload.fields([{ name: 'productImage', maxCount: 1 }, { name: 'productImages', maxCount: 10 }]),userController.productRegistration)  



router.post("/seller/oder/status/change/:id",async (req,res,next)=>{
    const id = req.params.id
    const status = req.body.dil
  
   const data = await cart.findByIdAndUpdate(id,{ $set: {  delivery: status} })
  // console.log(data);

    res.redirect("/seller/deshboard?status="+ status)
  })

  



router.post("/seller/account/update",async (req,res,next)=>{
  
    if(req.body.update == "seller"){
      const seid = req.body.sellerid
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email
    const mobile = req.body.mobile
    const bank = req.body.bankAccount.bankName
    const account = req.body.bankAccount.accountNumber
    const ifsc = req.body.bankAccount.ifscNumber
  
    const data = await user.findByIdAndUpdate(seid,{ $set: { firstName,lastName,email,mobile,"bankAccount.bankName": bank,"bankAccount.accountNumber": account,"bankAccount.ifscNumber": ifsc} })
    .then(updatedShop => {
      console.log(updatedShop);
      res.redirect(`/seller/account/${seid}?update=` + "self")
    })
    .catch(err => {
      console.error(err);
    });
    }
    if(req.body.update == "shop"){
      const seid = req.body.sellerid
      const sid = req.body.shopid
      const shopName  = req.body.shopName
      const  address = req.body.address.street
      const  city = req.body.address.city
      const state  = req.body.address.state
      const zip  = req.body.address.zip
      // console.log(sid);
  
    const data = await shop.findByIdAndUpdate(sid, {shopName:shopName, "address.street": address, "address.city": city, "address.state": state, "address.zip": zip }, { new: true })
    .then(updatedShop => {
      console.log(updatedShop);
      res.redirect(`/seller/account/${seid}?update=`+ "shop")
  
    })
    .catch(err => {
      console.error(err);
    });
    }
  })
  


  router.get("/seller/order/view",async(req,res,next)=>{
    const cookieToken = req.cookies.token
  jwt.verify(cookieToken, process.env.Secret_Key,async (err, decoded)=>{
  if(err){
    res.redirect("/seller/login")
  }else{
    const seller = await user.findById(decoded._id)
    const orders = await cart.find({sellerId:decoded._id,payment:"complete"})
    // console.log(seller + orders);
    res.render("sellerOrderView",{seller,orders})
  }
})
  })
  

  router.get("/seller/cancel/view",async(req,res,next)=>{
    const cookieToken = req.cookies.token
  jwt.verify(cookieToken, process.env.Secret_Key,async (err, decoded)=>{
  if(err){
    res.redirect("/seller/login")
  }else{
    const seller = await user.findById(decoded._id)
    const orders = await orderCancel.find({sellerId:decoded._id})
    // console.log(seller + orders);
    res.render("sellerCancelView",{seller,orders})
  }
})
  })
  



  router.get("/seller/rating/view/products",async(req,res,next)=>{
    const cookieToken = req.cookies.token
    jwt.verify(cookieToken, process.env.Secret_Key,async (err, decoded)=>{
    if(err){
      res.redirect("/seller/login")
    }else{
      const seller = await user.findById(decoded._id)
      const products = await product.find({ seller: decoded._id });
const productIds = products.map(product => product._id.toString());
const ratingDocs = await rate.find({ productid: { $in: productIds } });
const numReviews = ratingDocs.length;
let totalRating = 0;
let ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
for (let i = 0; i < numReviews; i++) {
  const rating = ratingDocs[i].rate;
  if (rating && rating >= 1 && rating <= 5) {
    totalRating += ratingDocs[i].rate;
    ratingCounts[rating]++;
  }
}
const averageRating = (totalRating / numReviews).toFixed(1);
const realrate = Math.floor(averageRating * 2) / 2;
// console.log(ratingCounts);
// console.log(realrate);
const like = req.query.update;
res.render("sellerProductRating", { seller, rating: ratingDocs,realrate,ratingCounts, like });
 
    }
  })
  })




  router.get("/seller/logout",async(req,res,next)=>{
    try {
    
      res.clearCookie("token")
    } catch (error) {
      console.log(error);
    }
    // const logout = true
    res.redirect("/seller/login")
  
  })




router.post("/seller/oder/return/change/:id",async(req,res,next)=>{
  console.log(req.body.dil);
  orderCancel.updateMany({ _id: req.params.id } , { $set: { delivery: req.body.dil } }).then((data)=>{
  console.log(data);
  res.redirect("/seller/deshboard?returnUpdate=" + true)
})
})


router.post("/seller/rating/reply/:id", async (req, res, next) => {
  try {
    const { dil } = req.body; 
    const data = await rate.findByIdAndUpdate(
      req.params.id,
      { $set: { like: dil } } 
    );
    const datas = await rate.findById(req.params.id);
    res.redirect("/seller/rating/view/products?update=true");
  } catch (err) {
    console.error(err);
  }
});



module.exports = router;