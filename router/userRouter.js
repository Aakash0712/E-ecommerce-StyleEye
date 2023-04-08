const express = require('express');
const router = express.Router();
// const user = require('../models/userModels')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const alert = require('alert')
const userController = require('../controller/userController');
const authController = require('../controller/authController');
const {user, shop , otpModel, problems} = require('../models/userModels')
const {cart , userAddress, orderCancel} = require('../models/oderModuls')
const {rate} = require('../models/productRatingOrModel')
const {product} = require('../models/product')
const cookieParser = require('cookie-parser')
require("dotenv").config();
router.use(cookieParser());
const stripe = require('stripe')(process.env.SECRET_KEY_STRIP)
const nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");



router.post("/user/register",userController.userRegistration)


router.post("/user/login",userController.userLogin)




router.post("/user/product/select",(req,res,next)=>{
    const oderdata = new cart (req.body)
    const limit =req.body.limit
    const Quanity = req.body.productQuanity

    const cookieToken = req.cookies.token
    jwt.verify(cookieToken, process.env.Secret_Key,async (err, decoded)=>{
      if(err){
        res.redirect("/login")
      }else{
        const usermach = await user.findById(decoded._id)
        const seller = true;
      if(Quanity > limit){
        const limit = true;
          res.redirect(`/single/product/${oderdata.productId}?limit=`+ limit)
        }else{
        if(usermach.role == "seller"){res.redirect(`/single/product/${oderdata.productId}?seller=`+seller)}else{

          
          oderdata.save(err=>{
                if(err){
                    console.log(err);
                }else{
                    console.log("product add on cart");
                    if(req.body.submit == "buy"){
        
                       res.redirect("/user/address")
                      }
                      if(req.body.submit == "addtocard"){
                        const cart = "done";                      
                        res.redirect(`/single/product/${oderdata.productId}?cart=`+cart)
                      }
                    }
                  })
                  
                }
          }
        }
        })  

   
})




router.post("/user/address",(req,res,next)=>{
    const addressdata = new userAddress(req.body)
    addressdata.save(err=>{
        if(err){
            console.log(err);
        }else{
            console.log("User Address Save");
            res.redirect("/cartpage")
        }
    })
})




const dateTime = require('node-datetime');
const { assign } = require('nodemailer/lib/shared');
var dt = dateTime.create();
var oderDate = dt.format('Y-m-d');
console.log(oderDate);
router.post('/user/payment',async(req, res,next)=>{

    console.log(req.body.Productid[0]);
    console.log(req.body.Productid[1]);
    const quanity = req.body.cartProductQus
    const ids = req.body.cartProductIds
    const limit = req.body.limit
    const pids = req.body.Productid
    console.log(pids);
    const totalPrice = req.body.total
    try {
      const result = await cart.updateMany({_id:ids}, { $set: {  delivery: 'waiting confirmation',buyQuantity:quanity, totalBill:totalPrice, payment:"complete", oderDate } });
      console.log(result);
    } catch (err) {
      console.log(err);
    }
    for (let i = 0; i < pids.length; i++) {
      const index = 0;
      const pid = pids[i];
      const qty = limit[i]-quanity[i];
      console.log(qty);
      
      try {
        const result = await product.updateMany({_id:pid}, { $set: { [`variants.${index}.variantsSku`]: qty }  });
        console.log(result);
      } catch (err) {
        console.log(err);
      }
    }

    res.redirect("/user/oders/track")
    
})


router.post("/user/rate/product",(req,res,next)=>{
  const productid = req.body.productid
  if(req.body.rate < 6){
    const data = new rate(req.body)
    data.save(err=>{
      if(err){console.log(err);}
      else{
        console.log("product rating save");
        res.redirect(`/single/product/${productid}`)
      }
    })
  }else{
    
    res.redirect(`/product/rating/${productid}`)
  }
 
})



router.post("/user/profile/update",(req,res,next)=>{
  const cookieToken = req.cookies.token
  jwt.verify(cookieToken, process.env.Secret_Key,async (err, decoded)=>{
  
    const data = {
      firstName:req.body.firstName,
      lastName:req.body.lastName,
      email:req.body.email,
    mobile:req.body.mobile,
    
   }
   const addressdata = {
    address:req.body.address,
    city:req.body.city,
    state:req.body.state,
    zip:req.body.zip,
  }
  //  console.log(data);
   const updatedata =await userAddress.findOneAndUpdate({userId:decoded._id}, addressdata)
   const userupdatedata = await user.findByIdAndUpdate(decoded._id, data)
   const updateDone = true;
   res.redirect("/user/profile?done="+ updateDone)
  })
})




router.post("/forgot/password",async(req,res,next)=>{
  const email = req.body.email;
  const role = req.body.role;
  const emailId = process.env.EMAIL_ID
  const password = process.env.PASSWORD
  const otp = Math.floor(100000 + Math.random() * 900000);
  const userdata = await user.findOne({
    email
  })

  if(role == "user"){
    // console.log(userdata);
    if(userdata == null){
      res.redirect("/user/forgot/password?wrongemail="+ true)
    }else{
  // console.log("this is user");
      const transporter = nodemailer.createTransport({
        service: 'gmail',
      auth: {
        user: emailId,
        pass: password
      }
    });
    
    const opsion = {
      from: emailId,
      to: email,
      subject: 'Email Verification OTP',
      text: `Hello Customer This From StyleEye varification code (OTP) :  ${otp}.`
      
    };
    transporter.sendMail(opsion,async function(error, info){
      if (error) {
        console.log(error);
      } else {

        const hashotp = await bcrypt.hash(`${otp}`, 4)
        console.log(hashotp);
        res.redirect(`/user/forgot/vrify/${email}?otp=${hashotp}`)
        
      }
    });
  }

    
  }else if(role == "seller"){
    
    if(userdata == null){
      res.redirect("/seller/forgot/password?wrongemail="+true)
    }else{
  
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailId,
          pass: password
        }
    });
    
    const opsion = {
      from: emailId,
      to: email,
      subject: 'Email Verification OTP',
      text: `Hello Seller This From StyleEye varification code (OTP) :  ${otp}.`
    };
    transporter.sendMail(opsion,async function(error, info){
      if (error) {
        console.log(error);
      } else {
        
        const hashotp = await bcrypt.hash(`${otp}`, 4)
        console.log(hashotp);
        res.redirect(`/seller/forgot/varify?otp=${hashotp}`)
      }
    });
    
  }
  }
});



router.post("/otp/compare", async(req,res,next)=>{
  const data  = new otpModel({
    date:req.date,
    hashotp:req.body.hashotp,
    role:req.body.role,
    email:req.body.email
  })
  const otp = req.body.otp;
  const hashotp = req.body.hashotp;
  const role = req.body.role;
  // const user = req.body.user;
  const email = req.body.email;
  const userData = await user.findOne({email})

  if(role == "user"){
    const doneotp =await bcrypt.compare(`${otp}`, hashotp);
    if(doneotp == true){
      const datasave =  await data.save()
      if(!datasave){
        console.log("otp data save problrm");
      }else{
        console.log("otp data save ");
        res.redirect(`/user/change/password/${userData._id}`);
      }
    }else{
      res.redirect(`/user/forgot/vrify/${email}?otp=${hashotp}`)
    }

  }else if(role == "seller"){

    const doneotp =await bcrypt.compare(`${otp}`, hashotp);
    if(doneotp == true){
      const datasave =  await data.save()
      if(!datasave){
        console.log("otp data save problrm");
      }else{
        console.log("otp data save ");
        res.redirect(`/seller/change/password/${userData._id}`);
      }
    }else{
      res.redirect(`/seller/forgot/vrify/${email}?otp=${hashotp}`)
    }

  }else{
    res.redirect(`/seller/forgot/vrify/${email}?otp=${hashotp}`)

  }
  

})




router.post("/change/password/:id",async(req,res,next)=>{
    const pass = req.body.Password;
    const passC = req.body.PasswordConfirm;
    console.log(pass);
    console.log(passC);
const savedata = {
  userpassword: req.body.Password,
  machPassword:req.body.PasswordConfirm
}
    if(pass === passC){

      
        const userdata = await user.findByIdAndUpdate(req.params.id,savedata)
        console.log(userdata);
        const userrole =await user.findById(req.params.id);
        console.log(userrole);
        if(userrole.role == "user"){
          res.redirect("/login");
        }else if(userrole.role == "seller"){
          res.redirect("/seller/login");

        }
    }
})



router.post("/user/order/cancel/form",async(req,res,next)=>{
  const savedata = new orderCancel(req.body)
  const done =await savedata.save()
  // console.log(done);
  const id = req.body.id;
  // console.log(id);
  await cart.findByIdAndDelete(id).then(deletedCart => {
    console.log(`Successfully deleted cart with ID ${deletedCart._id}`);
  })
  .catch(error => {
    console.log(`Error deleting cart: ${error}`);
  });
  const productQuanity = req.body.productQuanity;
  const productid = req.body.productId;
  
   const data = await product.findById(productid)
  // console.log(data.variants[0].variantsSku);
  const total = Number(data.variants[0].variantsSku) + Number(productQuanity);
  // console.log(total);
  const update = await product.findByIdAndUpdate(productid,{ $set: { 'variants.0.variantsSku': total } }, { new: true })
  // console.log(update);
  res.redirect("/cancel/orders")
})
console.log(40+45);





router.post("/user/:contact",async(req,res,next)=>{
    const data = new problems(req.body)
    data.save(err=>{
      if(err){
        console.log(err);
      }else{
        if(req.params.contact == "feedback"){
          res.redirect("/home")
          
        }else{
          res.redirect('back')

        }
      }
    })
})


module.exports = router;