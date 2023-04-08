
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const schema = mongoose.Schema;

const pay = ['pending', 'complete'];

const delivery = ['waiting confirmation','pick up', 'on process', 'on delivery','delivered'];

const registrationData = new schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId, 
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId, 
    },
    sellerId:{
        type: mongoose.Schema.Types.ObjectId, 
    },
    productPrice:{
        type:Number,
        require:true
    },
    productTitle:{
        type:String,
        require:true
    },
    productColor:{
        type:String,
        require:true
    },
    category:{
        type:String,
        require:true
    },
    image:{
        type:String,
        require:true
    },
    productSize:{
        type:String,
        require:false
    },
    productQuanity:{
        type:Number,
        require:true
    },
    payment:{
        type:String,
        enum: pay,
        default: 'pending'
    },
    limit:{
        type:String,
        require:true
    },
   
})
registrationData.add({
    totalBill:{
        type:Number,
    },
    buyQuantity:{
        type:[Number],
    },
    
    delivery:{
        type:String,
    },
    oderDate:{
        type:String,
    }
})


const address = new schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId, 
    },
    address:{
        type:String,
        require:true
    },
    city:{
        type:String,
        require:true
    },
    state:{
        type:String,
        require:true
    },
    zip:{
        type:Number,
        require:true
    }, 
})

const dateTime = require("node-datetime")
const dt = dateTime.create();
const date = dt.format('d-m-Y H:M');
console.log(date);
const cancelOrder = new schema({
    date:{type:String,default:date},
    reason:{type:String,required:true},
    feedback:{type:String,required:true},
    userId:{type: mongoose.Schema.Types.ObjectId, },
    productId:{type: mongoose.Schema.Types.ObjectId, },
    sellerId:{type: mongoose.Schema.Types.ObjectId, },
    productTitle:{type:String},
    productColor:{type:String},
    category:{type:String},
    delivery:{type:String},
    payment:{type:String},
    oderDate:{type:String},
    productQuanity:{type:Number},
    productPrice:{type:Number},
})






const cart = mongoose.model('cart', registrationData);
const userAddress = mongoose.model('userAddress', address);
const orderCancel = mongoose.model('cancelOrder', cancelOrder);
module.exports = {cart , userAddress,orderCancel}
