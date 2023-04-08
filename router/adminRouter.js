const express = require('express');
const router = express.Router();
const multer = require('multer')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const alert = require('alert')
const chart = require('chart.js');
const userController = require('../controller/userController');
const authController = require('../controller/authController');
const {search} = require('../controller/searchController');
const {user,shop,otpModel,problems} = require('../models/userModels')
const {cart , userAddress} = require('../models/oderModuls')
const {product} = require('../models/product')
const cookieParser = require('cookie-parser')
router.use(cookieParser());
const getController = require("../controller/getController")



router.get("/admin/login",(req,res,next)=>{
    
    res.render("adminLogin",{
      update:req.query.update
    })
})
router.post("/admin/login",(req,res,next)=>{

  const userName = req.body.userName;
  const password =req.body.password;

  

  if(userName == "admin"){
        if(password == "admin"){
            res.redirect("/admin/dashbord")
        }else{
    res.redirect("/admin/login?update="+"password")
        }
  }else{
    res.redirect("/admin/login?update="+"userName")
  }
})

router.get("/admin/dashbord",async (req,res,next)=>{
try {
  
   await user.find({
        role:"seller"
    }).then((seller)=>{
        user.find({
            role:"user"
        }).then((user)=>{
            product.find().then((product)=>{

const sunglasses = product.filter(person => person.category === "sunglasses");
const sunglasse = sunglasses.map(person => person.category);

const sunlength = Number (sunglasse.length)
const computerglasses = product.filter(person => person.category === "computerglasses");
const computerglassesl = computerglasses.map(person => person.category);

const computerlength = Number (computerglassesl.length)

const contactlens = product.filter(person => person.category === "contactlens");
const contactlensl = contactlens.map(person => person.category);

const contactlength = Number (contactlensl.length)

const powerglasses = product.filter(person => person.category === "powerglasses");
const powerglassesl = powerglasses.map(person => person.category);

const powerlength = Number (powerglassesl.length) 
                const data =  {
                    labels: ["Sunglasses", "Computerglasses", "Powerglasses","Contactlens"],
                    datasets: [{
                      data: [sunlength, computerlength, powerlength, contactlength],
                      backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc','#fd7e14'],
                      hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf','#fd7e14'],
                      hoverBorderColor: "rgba(234, 236, 244, 1)",
                    }],
                         }

                         const uniqueDates = product.reduce((acc, curr) => {
                            if (!acc.includes(curr.date)) {
                              acc.push(curr.date);
                            }
                            return acc;
                          }, []);
                        
                          const dateCounts = uniqueDates.reduce((acc, curr) => {
                            const count = product.filter((p) => p.date === curr).length;
                            acc[curr] = count;
                            return acc;
                          }, {});
                          
                              const counts = Object.values(dateCounts);
                            
                          const data2 = {
                            labels: uniqueDates,
                            datasets: [{
                              label: "New Product",
                              backgroundColor: "#4e73df",
                              hoverBackgroundColor: "#2e59d9",
                              borderColor: "#4e73df",
                              data: counts,
                            }],
                          }
                cart.find().then((cart)=>{
                    const uniqueOrderDates = cart.reduce((acc, curr) => {
                        if (!acc.includes(curr.oderDate)) {
                          acc.push(curr.oderDate);
                        }
                        return acc;
                      }, []);
                    
                      const orderDateCounts = uniqueOrderDates.reduce((acc, curr) => {
                        const count = cart.filter((p) => p.oderDate === curr).length;
                        acc[curr] = count;
                        return acc;
                      }, {});
                      
                          const order = Object.values(orderDateCounts);

                        const data3 =  {
                            labels: uniqueOrderDates,
                            datasets: [{
                              label: "Order With Date",
                              lineTension: 0.3,
                              backgroundColor: "rgba(78, 115, 223, 0.05)",
                              borderColor: "rgba(78, 115, 223, 1)",
                              pointRadius: 3,
                              pointBackgroundColor: "rgba(78, 115, 223, 1)",
                              pointBorderColor: "rgba(78, 115, 223, 1)",
                              pointHoverRadius: 3,
                              pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                              pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                              pointHitRadius: 10,
                              pointBorderWidth: 2,
                              data: order,
                            }],
                          }
                    shop.find().then((shop)=>{
                        userAddress.find().then((address)=>{
                         
                          
                          res.render("adminDashbord",{
                            seller,
                            user,
                            shop,
                            address,
                            cart,
                            product,
                            data,
                            data2,
                            data3,
                          })
                       
                            
                        })
                    })
                })
            })
        })
    })
      
} catch (error) {
  console.log(error);
}

})

product.find().then((product) => {
   
   
     
  });
 
  
  
router.get("/admin/feedbacks",async(req,res,next)=>{
 
      const data = await problems.find({})
      res.render("adminFeedback",{data})
     
})



router.get("/admin/sellers",(req,res,next)=>{
    user.find({role:"seller"})
    .then((seller)=>{
        const deletes = req.query.delete
        res.render("adminSeller",{
            seller,
            deletes,
        })
    })
})
router.get("/admin/stores",async(req,res,next)=>{
 
      const data = await shop.find({})
      
    res.render("adminStore",{data})
   
})
router.get("/admin/website/views",(req,res,next)=>{
    res.render("adminWebsiteView")
})
router.get("/admin/account",(req,res,next)=>{
    res.render("adminAccount")
})
router.get("/admin/customers",async(req,res,next)=>{
    const users = await user.find({role:"user"})
    const deletes = req.query.delete;
    res.render("adminCustomer",{
      users,
      deletes,
    })
})
router.get("/admin/money/transactions",async(req,res,next)=>{
 
      const data = await cart.find({payment:"complete"})
      res.render("adminMoneyManage",{data})
    
})




router.get("/admin/orders",async(req,res,next)=>{

      const order =  await cart.find({payment:"complete"})
      res.render("adminOrder",{order})
    
})
router.get("/admin/products",async(req,res,next)=>{
    const products  = await product.find()
    const deletes = req.query.delete;
    res.render("adminProduct",{
      products,
      deletes,
    })
})



router.get("/admin/seller/delete/:id",(req,res,next)=>{
  user.findByIdAndDelete(req.params.id).then((data)=>{console.log(data);}).catch(err=>{console.log(err);})
  // console.log(req.params.id);
  // const seller = "seller"
  res.redirect("/admin/sellers?delete="+"seller")
})



router.get("/admin/user/delete/:id",(req,res,next)=>{
  user.findByIdAndDelete(req.params.id).then((data)=>{console.log(data);}).catch(err=>{console.log(err);})
  // console.log(req.params.id);
  // const seller = "seller"
  res.redirect("/admin/customer?delete="+"Customer")
})


router.get("/admin/product/delete/:id",(req,res,next)=>{
  product.findByIdAndDelete(req.params.id).then((data)=>{console.log(data);}).catch(err=>{console.log(err);})
  // console.log(req.params.id);
  // const seller = "seller"
  res.redirect("/admin/products?delete="+"Product")
})



// product.find({seller:"64075d42f05818e18c30f7e3"}).then((data)=>{

// })


module.exports = router;