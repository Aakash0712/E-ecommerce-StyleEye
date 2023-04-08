// const { cache } = require('ejs');
// const mongoose = require('mongoose');
// const schema = mongoose.Schema;
// const validator = require('validator')


// const customer = new schema({
//     firstName:{
//         type:String,
//         // required:[true, "Enter Your First Name"],
//         // minLenth:[2,"Enter  Your Valid Name"],
//         // maxLenth:[10,"Maximum Lenth Is 10"]
        
//     },
//     lastName:{
//         type:String,
//         // required:[true, "Enter Your Last Name"],
//         // minLenth:[2,"Enter Your Valid Name"],
//         // maxLenth:[10,"Maximum Lenth Is 10"]
//     },
//     email:{
//         type:String,
//         // required:[true,"Enter Your Email"],
//         // lowercase:true,
//         // unique:[true,"This Email Alredy Exists!"],
//         // validate:[validator.isEmail,"Provide a valid email"]
//     },
//     mobile:{
//         type:Number,
//         // required:[true,"Enter your movile number"],
//         // minLenth:[10,"Enter valid number"],
//         // maxLenth:[10,"Enter valid number"],
//         // unique:[true,"This number are alredy exists!"]
//     },
//     role:{
//         type:String,
//         enum: ["user", "driver", "admin"],
//         default:"user",

//     },
//     password:{
//         type:String,
//         // required:[true,"Enter password"],
//         // minLenth:[8,"Password will be 8 characters"],
//         // select:false,
//     },
//     machPassword:{
//         type:String,
//         // required:[true," Re-enter password"],
//         // validate:{
//         //     validator:(pass)=>{
//         //         return pass === this.password;
//         //     },
//         //     message:"Password is not match!"
//         // },
//     },

// })


// module.exports = mongoose.model('User',customer);


const mongoose = require('mongoose');

const schema = mongoose.Schema;

const roles = ['user', 'admin', 'seller'];

const registrationData = new schema({
    firstName :{
        type :String,
        require :true
    }, 
    lastName :{
        type :String,
        require :true
    },
    email :{
        type :String,
        require :true
    },
    mobile :{
        type :Number,
        require :true
    },
    role: {
        type: String,
        enum: roles,
        default: 'user'
      },
    userpassword :{
        type :String,
        require :true
    },
    machPassword :{
        type :String,
        require :true
    },
    address: {
      street: String,
      city: String,
      state: String,
      zip: Number,
    },
   
    bankAccount: {
        bankName: String,
        accountNumber: Number,
        ifscNumber: String,
      },

})


const shopSchema = new mongoose.Schema({
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
    shopName: { type: String, required: true },
    address: {
      street: String,
      city: String,
      state: String,
      zip: Number,
    },
    
  });

const dateTime = require("node-datetime")
var dt = dateTime.create();
var date = dt.format('d/m/Y H:M:S');


  const otpdata = new mongoose.Schema({
    email:{type:String,required:true},
    role:{type:String,required:true},
    hashotp:{type:String,required:true},
    date:{type:String,default:date}
  })




  const feedbackAndContact = new mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId},
    email:{type:String, required:true},
    problem:{type:String, required:true},
    typeOfForm:{type:String,}
  })



const user = mongoose.model('User', registrationData);
const shop = mongoose.model('Shop', shopSchema);
const otpModel = mongoose.model('otp', otpdata);
const problems = mongoose.model('FeedbackAndContact', feedbackAndContact);

module.exports = {user,shop,otpModel,problems}
// const Moderator = mongoose.model('Moderator', registrationData);

// const mongoose = require('mongoose');

// // Define the possible roles as an enum

// // Create a schema for the user model
// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
// });

// // Create the user model based on the schema
// const User = mongoose.model('User', userSchema);
