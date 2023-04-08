const express = require('express');
const router = express.Router();
const { user, shop } = require('../models/userModels')
const { product } = require('../models/product')
const jwt = require('jsonwebtoken')

const cookieParser = require('cookie-parser')
router.use(cookieParser());


const userRegistration = async (req, res, next) => {
    const userdata = new user(req.body)

    const userEmail = await user.find({
        email: req.body.email
    })
        .then((data) => {
            if (data.email == req.body.email) {
                console.log("//- Invalid Email id! -//");
            } else {
                if (req.body.userpassword == req.body.machPassword) {

                    userdata.save(err => {
                        if (err) {
                            console.log(err)
                        } else {
                            const token = jwt.sign({_id:userdata._id},process.env.Secret_Key)

                            res.cookie("token", token)
                            if (userdata.role == "seller"){
                                const login = "login";

                                res.redirect("/seller/shop/registration?login="+login)

                            }else{
                                const login = "login";
                                
                                res.redirect("/home?login="+login)
                            }

                            console.log("//- User Data Save -//")
                        }
                    })
                }else{
                    console.log("password wrog");
                }
            }


        })

}



const userLogin = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password

    user.findOne({
        email: email
    })
        .then((data) => {
            if (data.userpassword == password) {
                // res.cookie("user", data._id);
                if (data.role == "seller") {
                    shop.findOne({
                        seller:data._id
                    })
                    .then((shop)=>{
                        const token = jwt.sign({_id:data._id, shop:shop._id},process.env.Secret_Key)
        
                        res.cookie("token", token)
                        const login = "login";

                        return res.redirect("/seller/deshboard?login="+ login)
                    })

                } else {
                    const token = jwt.sign({_id:data._id},process.env.Secret_Key)
                    res.cookie("token", token)
                    const login = "login";
                    res.redirect("/home?login="+ login)
                }
                // console.log(data._id)
            } else {
                const pass = "err";
                res.redirect("/login?pass="+pass)
                console.log("//- Password Invalid -//");
            }
        }).catch(err => {
            const email = "err";
            res.redirect("/login?email="+ email)
            console.log("//- Email Not Velid -//"); })
}



const shopRegistration = async (req, res, next) => {
    const shopdata = new shop(req.body)
    shopdata.save(err => {
        if (err) {
            console.log(err);
        } else {
            const cookieToken = req.cookies.token
            // const  varifytoken = jwt.varifytoken(cookietoken, process.env.Secret_Key);
            jwt.verify(cookieToken, process.env.Secret_Key, (err, decoded) => {
                if (err) {
                  res.redirect("/seller/login")
                } else {
                  // Token is valid, decoded contains the decoded token data
                  const token = jwt.sign({_id:decoded._id , shop:shopdata._id},process.env.Secret_Key);

                  res.cookie("token", token);
                  // res.cookie("shop",shopdata._id)
                  const login = "login";
                  res.redirect("/seller/deshboard?login="+login);
                  console.log("//- Shop Data Save -//");
             
                }
              });
            }
    })
}



const productRegistration = async (req, res) => {
    try {
        const Product = new product({
            date: req.Date,
            seller: req.body.seller,
            shop: req.body.seller,
            productName: req.body.productName,
            productDes: req.body.productDes,
            brand: req.body.brand,
            category: req.body.category,
            productImage: req.files.productImage[0].filename,
            productImages: req.files.productImages.map((file) => file.filename),
            variants: req.body.variants,
        });

        const savedProduct = await Product.save();
        const add = "add";
        res.redirect("/seller/deshboard?add="+add);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}

module.exports = { userRegistration, userLogin, shopRegistration, productRegistration }