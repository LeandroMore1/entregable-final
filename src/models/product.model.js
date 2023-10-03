import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

export const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        code: {
            type: Number,
            required: true,
            unique: true
        },
        stock: {
            type: Number,
            required: true
        },
        thumbnail: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true,
            enum: ['instruments','accesories','electronics']
        },
        owner: {
            type: String,
            default: "admin"
        }
        
    }
)

productSchema.plugin(mongoosePaginate)

 const productModel = mongoose.model('products', productSchema)
 export default productModel