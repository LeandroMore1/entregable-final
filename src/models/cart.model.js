import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products:[{
        product:{
        type:   mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: false,
        
    },
    quantity: {
      type: Number,
      min: 0
    }
    }]
})

const cartModel = mongoose.model('carts' , cartSchema)
export default cartModel