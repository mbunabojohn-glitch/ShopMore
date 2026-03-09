import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
productTitle:{
    type: String,
    required: true,
},

brand:{
type: String,
required: true,
},

price: {
    type: Number,
    required: true,
},

salesPrice: {
    type: String,
    required: true,
},

description: {
    type: String,
    required: true,
},

stock: {
    type: String,
    required: true
},

image: {
    type: String,
    required: true,
},
});

const Product = mongoose.model("product", productSchema)

export default Product;