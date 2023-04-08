
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const schema = mongoose.Schema;


const ratingdata = new schema({

    rate:{
        type:Number,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    comment: {
        type: String,
        required: true
      },
    userid:{
        type: String,ref: 'user'
    },
    productid:{
        type:String,ref: 'product'
    },
    like:{type:String},

    
})


// const shopSchema = new mongoose.Schema({
//     seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
//     shopName: { type: String, required: true },
//     address: {
//       street: String,
//       city: String,
//       state: String,
//       zip: Number,
//     },
    
//   });


const rate = mongoose.model('ratingINproduct', ratingdata);
// const shop = mongoose.model('Shop', shopSchema);

module.exports = {rate}
