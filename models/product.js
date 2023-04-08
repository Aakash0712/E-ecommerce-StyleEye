
const mongoose = require('mongoose');
const dateTime = require('node-datetime')
var dt = dateTime.create();
var date = dt.format('Y-m-d');
const Schema = mongoose.Schema;



// const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
// const roles = ['user', 'admin', 'seller'];

// const productdata = new schema({
//     productName :{
//         type :String,
//         require :true
//     }, 
//     productDes :{
//         type :String,
//         require :true
//     },
//     brand :{
//         type :String,
//         require :true
//     },
//     category :{
//         type :Number,
//         require :true
//     },
//     variants:[
//         {
//             variantId:{ type:String, },
//             variantsName:{ type:String, },
//             variantsDes:{type:String, },
//             variantsSku:{type:String, },
//             variantsPrice:{type:String, },
//             variantscolor:{type:String,},
//             variantsSize:{type:String, }
//         },
//         {
//             variantId:{ type:String, },
//             variantsName:{ type:String, },
//             variantsDes:{type:String, },
//             variantsSku:{type:String, },
//             variantsPrice:{type:String, },
//             variantscolor:{type:String,},
//             variantsSize:{type:String, }
//         },
//         {
//             variantId:{ type:String, },
//             variantsName:{ type:String, },
//             variantsDes:{type:String, },
//             variantsSku:{type:String, },
//             variantsPrice:{type:String, },
//             variantscolor:{type:String,},
//             variantsSize:{type:String, }
//         }
//     ],
    
// })
// const variantSchema = new Schema({
//     variantId: { type: String },
//     variantsName: { type: String },
//     variantsDes: { type: String },
//     variantsSku: { type: String },
//     variantsPrice: { type: String },
//     variantscolor: { type: String },
//     variantsSize: { type: String }
//   });
  
  const productSchema = new Schema({
    date:{type:String, default:date },
    seller: { type: mongoose.Schema.Types.ObjectId,  required: true },
    shop: { type: mongoose.Schema.Types.ObjectId,  required: true },
    productName: { type: String, required: true },
    productDes: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    variants: [ {
                    variantId:{ type:Number },
                    variantsName:{ type:String, },
                    variantsDes:{type:String, },
                    variantsSku:{type:Number, },
                    variantsPrice:{type:Number, },
                    variantscolor:{type:String,},
                    variantsSize:{type:String, }
                },
                {
                    variantId:{ type:String, },
                    variantsName:{ type:String, },
                    variantsDes:{type:String, },
                    variantsSku:{type:String, },
                    variantsPrice:{type:String, },
                    variantscolor:{type:String,},
                    variantsSize:{type:String, }
                },
                {
                    variantId:{ type:String, },
                    variantsName:{ type:String, },
                    variantsDes:{type:String, },
                    variantsSku:{type:String, },
                    variantsPrice:{type:String, },
                    variantscolor:{type:String,},
                    variantsSize:{type:String, }
                }],
    productImage: {
        type: String,
        required: true,
      },
      productImages: {
        type: [String],
        required: true,
      },
  });
  


  const like = new Schema({
    productId:{ type: mongoose.Schema.Types.ObjectId,  required: true },
    userId:{ type: mongoose.Schema.Types.ObjectId,  required: true },
    like:{type:Boolean,required:true}
  })

const product = mongoose.model('product', productSchema);
const likeModel = mongoose.model('like', like);

module.exports = {product,likeModel}
