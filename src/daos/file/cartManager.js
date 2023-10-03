import fs from "fs"
import logger from "../../utils/logger.js"
import productManager from "./productManager.js";

export default class cartManager {

    constructor() {
        this.path = "./carts.json"
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, JSON.stringify([]));
        }
    }

    id = 0

    async create(item) {
        try {
            let cart = await this.getCarts();
            if (!cart) {
                cart = []
            }
            let lastId = cart.length > 0 ? cart[cart.length - 1].id : 0;
            let newId = lastId + 1
            item.id = newId
            await cart.push(item)
            await fs.promises.writeFile(this.path, JSON.stringify(cart))
        } catch (err) {
            logger.error(err)
        }
    }


    async get() {
        try {
            const carts = await fs.promises.readFile(this.path)
            return JSON.parse(carts)
        } catch (err) {
            logger.error(err)
        }
    }

    async addProductToCart(cartId,prodId){
        try{
            const pm =  new productManager()
            const carts = await this.getCarts()
            const cartIndex = await carts.findIndex(el => el.id === cartId)
            const product = await pm.getProductById(prodId)
            const productId = await product.id
            
            
            if(cartIndex === -1 || !product){
                return false
            } else if (carts[cartIndex].products !== undefined && carts[cartIndex].products.findIndex(el => el.product === prodId) !== -1 ) {

                let existingProduct = await carts[cartIndex].products.findIndex(el => el.product === prodId)

                let qty = await carts[cartIndex].products[existingProduct].quantity +1

                carts[cartIndex].products[existingProduct] = await Object.assign(carts[cartIndex].products[existingProduct], {quantity: qty})

                await fs.promises.writeFile(this.path, JSON.stringify(carts))
                return true

            } else {

                await carts[cartIndex].products.push({product: productId, quantity: 1})
                await fs.promises.writeFile(this.path, JSON.stringify(carts))
                return true
            }
            
        } catch (err){
            logger.error(err)
        }
    }



    async getById(id){
        try{
            const carts = await this.getCarts()
            let found = await carts.findIndex(el => el.id === id)
            if(found === -1){
                return false
            } else{
                const cartFound = await carts[found]
                return cartFound
            }
        } catch(err){
            logger.error(err)
        }
    }
}

