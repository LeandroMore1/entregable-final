import fs from "fs"
import logger from "../../utils/logger.js"


export default class productManager {

    

    constructor() {
        this.path = "./products.json"
        if (!fs.existsSync(this.path)) {

            fs.writeFileSync(this.path, JSON.stringify([]))
        }
    }



    async addProduct(product) {
        try {
            let getProducts = await this.getProducts()
            if (!getProducts) {
                getProducts = []
            }
            let lastId = getProducts.length > 0 ? getProducts[getProducts.length - 1].id : 0
            let newId = lastId + 1
            product.id = newId
            product.status = true
            let code = await getProducts.findIndex(el => el.code === product.code)
            
            if (code !== -1) {
                return 1
            } else if (Object.keys(product).length !== 9 || !product.title ||  !product.description ||  !product.thumbnail ||  !product.code || !product.category || !product.price ||  !product.stock) {
                return 2
            } else {
                await getProducts.push(product)
                await fs.promises.writeFile(this.path, JSON.stringify(getProducts))
            }

        } catch (err) {
            logger.error(err)
        }
    }

 

    async updateProduct(id, updateAttr) {
        try {
            const products = await this.getProducts()
            let productId = await products.findIndex(el => el.id === id)
            let code
            if (productId !== -1) code = products[productId].code


            if (productId === -1) {

                return 1

            } else if (updateAttr.id && updateAttr.id !== id || updateAttr.code && updateAttr.code !== code) {

                return 2

            } else {

                products[productId] = await Object.assign(products[productId], updateAttr)

                await fs.promises.writeFile(this.path, JSON.stringify(products))
                logger.error(await `se ha actualizado el producto con el id ${id}:`)
                return logger.error(products[productId])
            }

        } catch (err) {
            logger.error(err)
        }
    }


    async getProducts() {
        try {
            const products = await fs.promises.readFile(this.path, "utf-8")
            return JSON.parse(products)
        } catch (err) {
            logger.error(err)
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProducts()
            const find = await products.findIndex(el => el.id === id)
            if (find === -1) {
                return false
            } else {
                const productFound = await products[find]
                return productFound
            }
        } catch (err) {

        }
    }

    async getProductsByQuantity(qty){
        try{
            let products = await this.getProducts()
            if (qty === 0 || qty === undefined){
                return products
            } else{
                return products.slice(0, qty)
            }
            
        } catch (err){
            return logger.error(err)
        }
        
    }

    async deleteProduct(id) {
        try {
            let products = await this.getProducts()
            let productId = await products.findIndex(el => el.id === id)

            if (productId !== -1) {
                await products.splice(productId, 1)
                await fs.promises.writeFile(this.path, JSON.stringify(products))
                return logger.error(`producto con id ${id} borrado existosamente`)
            } else {
                return logger.error("el producto no existe o ha sido borrado")
            }

        } catch (err) {
            logger.error(err)
        }
    }


}


