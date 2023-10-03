import cartDAO from "../daos/cart.dao.js";
import cartsRepository from "../repository/cart.repository.js";
import cartManager from "../daos/file/cartManager.js";
import config from "../env/config.js";

let persistence = config.PERSISTENCE || "mongodb"

let cartController

if (persistence === "mongodb"){
    cartController = new cartsRepository(cartDAO)
} else {
    cartController = new cartsRepository(cartManager)
}

export {cartController}
