import productDAO from "../daos/products.dao.js"
import productRepository from "../repository/product.repository.js"
import config from "../env/config.js";
import productManager from "../daos/file/productManager.js";

let persistence = config.PERSISTENCE || "mongodb"

let productController

if(persistence === "mongodb"){
    productController = new productRepository(productDAO)
} else{
    productController = new productRepository(productManager)
}

export {productController}
