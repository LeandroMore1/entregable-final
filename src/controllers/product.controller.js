import logger from "../utils/logger.js"
import jwt from "jsonwebtoken"
import config from "../env/config.js"
import { productController } from "../service/product.service.js"
import { userController } from "../service/user.service.js"
import mailService from "../config/mailing.config.js"

// SECTION - renderizar los products

export const products = async (req, res) => {
    try {
        const limit = req.query.limit || 10
        const page = req.query.page || 1
        const stock = req.query.stock || null
        const category = req.query.category || null
        let sort = null
        let filter = {}

        if (stock) {
            sort = { price: 1, stock: stock }
        }
        if (category) {
            filter = { ...filter, category }
            sort = { price: 1 }
        }

        let products = await productController.getProductsByPagination(limit, page, filter, sort)
        let user = req.user
        if (user) products.cartId = user.cart
        res.render('products', { products, user })
    } catch (err) {
        logger.error(`error en el endpoint ${req.url} de productos:\n${err}`)
        res.status(500).send(err)
    }

}

// SECTION - agregar producto

export const createProduct = async (req, res) => {
    try {
        const token = req.cookies.token
        const user = jwt.verify(token , config.PRIVATEKEY)
        let prodToAdd = req.body
        if (user.user.role === "premium") {
            prodToAdd.owner = user.user.email
            await productController.addProduct(prodToAdd)
        } else {
            await productController.addProduct(prodToAdd)
        }
        
        return res.status(200)
    } catch (err) {
        logger.error(`error al intentar crear el producto en endpoint ${req.url}:\n${err}`)
        return res.status(500).send(err)
    }
}

// SECTION - eliminar producto

export const deleteProduct = async (req,res)=> {
    try{
        const token = req.cookies.token
        const user = jwt.verify(token , config.PRIVATEKEY)
        const prodToDel = req.body.prodToDel
        const product = await productController.findProductById(prodToDel)
        let prodOwner
        product.owner? prodOwner = await userController.getUserByEmail(product.owner) : prodOwner
        if(!product){
            logger.error('el producto buscado no existe o ha sido eliminado')
            return res.status(404).send('product not found')
        }else if(  user.user.email !== product.owner && user.user.role !== "admin" ){
            logger.error('solo el admin puede borrar productos que no sean suyos')
            return res.status(400).send('only admin allowed to erase other owner product')
        } else if(product.owner !== "admin"){
            await productController.deleteProduct(prodToDel)
            const mailOptions = {
                from: config.NODEMAILER_EMAIL,
                to: product.owner,
                subject: 'Tu producto ha sido eliminado',
                html: `<h1>Hola ${prodOwner.name}</h1>
                <p>te informamos que tu producto ${product.title} ha sido eliminado</p>`
                
            }
            const mailer = new mailService()
            await mailer.sendMail(mailOptions)
            logger.info(`se borro el producto de ${product.owner}`)
            res.status(200).send('producto borrado satisfactoriamente')
        } else{
            await productController.deleteProduct(prodToDel)
            logger.info('se borro el producto')
            res.status(200).send('producto borrado satisfactoriamente')
        }
    }catch(err){
        logger.error(`error al intentar eliminar el producto en endpoint ${req.url}:\n${err}`)
        return res.status(500).send(err)
    }
}


