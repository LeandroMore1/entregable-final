import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    lastName: String,
    email: {unique: true, required: true, type:String, index: true},
    age: Number,
    password: String,
    cart: {
        type:   mongoose.Schema.Types.ObjectId,
        ref: 'carts',
    },
    documents:[
        {
            name: {
                type:String,
                required: true
            }
        },
        {
            reference: {
                type:String,
                required: true
            }
        }
    ]
    ,
    img: String,
    role: {
        type: String,
        default: "user"
    },
    last_connection: Date
})      

const userModel = mongoose.model('users' , userSchema)

export default userModel