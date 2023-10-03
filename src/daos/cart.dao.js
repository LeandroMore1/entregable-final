import  cartModel  from "../models/cart.model.js";



class CartsDAO {
    constructor() {
        this.model = cartModel
    }

    async get(){
        return await this.model.find().lean()
    }

    async getProductsInCart(id) {
        const findCart = await this.model.findOne({ _id: id }).populate('products.product').lean()
        return findCart
    }

    async create(){
        const newCart = new this.model();
        const savedCart = await newCart.save();
        const cartId = savedCart._id;
        return cartId
    }

    async update(id, update){
        await this.model.findOneAndUpdate({ _id: id },{ $set: update})
    }

    async delete(id){
        await this.model.deleteOne(id)
    }

    async getBy(param) {
        const cart = await this.model.findOne(param)
        return cart
    }
}

export const cartDAO = new CartsDAO()

export default cartDAO