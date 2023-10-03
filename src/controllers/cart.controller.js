
import { cartController } from "../service/cart.service.js";
import { ticketController } from "../service/ticket.service.js";
import { productController } from "../service/product.service.js";
import config from "../env/config.js";
import jwt from 'jsonwebtoken'
import logger from "../utils/logger.js";


// SECTION - realizar compra

export const purchase = async (req, res) => {
    try {

        const cid = req.params.cid
        const user = req.user
        const mongoCart = await cartController.findCartById(cid)
        const cartProducts = await cartController.getProductsInCart(cid)
        const cart = cartProducts.products.map(el => el)
        let stockUpdated = []
        let productsNotBought = []
        let total = 0

        for (let i = cart.length - 1; i >= 0; i--) {
            const prodPosition = cart[i];
            if (prodPosition.quantity > prodPosition.product.stock) {
                productsNotBought.push(cart[i])  // NOTE meto los productos que no tenian stock suficiente en un array
                cart.splice(i, 1)
            } else {
                prodPosition.product.stock = prodPosition.product.stock - prodPosition.quantity; // NOTE resto stock al producto comprado
                stockUpdated.push(cart[i].product) // NOTE pusheo el producto con el nuevo stock para actualizar products
                total = (prodPosition.product.price * prodPosition.quantity) + total
            }
        }

        logger.debug(`length de productsNotBought: ${productsNotBought.length}`)
        logger.debug(`length de cart: ${cart.length}`)

        if (cart.length !== 0) {
            await ticketController.createTicket({
                code: Date.now() + Math.floor(Math.random() * 10000 + 1),
                purchase_dateTime: new Date(),
                amount: total,
                purchaser: user.email
            })
            const cartAfterBuy = productsNotBought.map(el => ({
                product: el.product._id,
                quantity: el.quantity
            }))

            mongoCart.products = cartAfterBuy

            await cartController.updateCart(cid, mongoCart)

            for (const prod of stockUpdated) {
                const id = prod._id
                const product = { stock: prod.stock }
                await productController.updateProduct(id, product)
            
            }
            return res.status(200).send('purchase successful')
        } else{
            logger.error('stock insuficiente')
            return res.status(400).send('no hay stock suficiente para los productos que buscas!')
        }        
    } catch (err) {
        logger.fatal(`error con la compra en ${req.url}:\n${err} `)
        return res.status(500).send('internal server error')
    }

}

// SECTION - greet 


export const purchaseGreet = async (req, res) => {
    try {
        let user = req.user
        const delayTime = 3000

        setTimeout(async () => {
        const test = await cartController.getProductsInCart(user.cart)
            let prodsRemaining = test.products.map(el => ({
                product: el.product.title.toString(),
                quantity: el.quantity
            }))

        let ticket = await ticketController.getTicketByEmail(user.email)

        logger.debug(JSON.stringify(ticket))

        const date = new Date(ticket.purchase_dateTime) 
        const year = date.getFullYear()
        const month = date.getMonth() +1
        const day = date.getDate()
        logger.debug(day)
        const localDate = `${year}/${month < 10? 0 : ""}${month}/${day < 10? 0 : ""}${day}`

        ticket.date = localDate

            res.render('purchaseGreet', { prodsRemaining, user ,ticket})
        }, delayTime)


    } catch (err) {
        logger.warning(`error en ${req.url}:\n${err} `)
        return res.status(500).send('internal server error')
    }

}


// SECTION - Obtener y renderizar productos 


export const getCart = async (req, res) => {
    try {
        let user = req.user
        const data = await cartController.getProductsInCart(user.cart)
        const cid = user.cart.toString()
        const cartData = data.products

        res.render('cart', { cartData, cid, user })
    } catch (err) {
        logger.warning(`error al intentar obtener el cart en ${req.url}:\n ${err}`)
        return res.status(500).send('internal server error')
    }

}

// SECTION - Agregar producto al cart


export const addProductToCart = async (req, res) => {
    try {
        // const user = req.user
        const token = req.cookies.token
        let user
        user = jwt.verify(token, config.PRIVATEKEY)
        user = user.user
        const productSelected = req.body.prodId
        const cid = req.params.cid
        const cart = await cartController.findCartById(user.cart)
        const product = await productController.findProductById(productSelected)
        const find = cart.products.find(el => el.product.toString() === productSelected)
        if(product.owner && product.owner === user.email){
            logger.error('error, no puede agregar productos que usted haya creado')
            return res.status(400).send('owner cannot add products created by himself to the cart')
        }else if (find === undefined) {
            const productToAdd = { product: productSelected, quantity: 1 }
            cart.products.push(productToAdd)
            await cartController.updateCart(cid, cart)
        }
        res.status(200).send("Product added to cart successfully")
    } catch (err) {
        logger.warning(`error al intentar agregar un producto al cart ${req.url}:\n ${err}`)
        return res.status(500).send('internal server error')
    }

}


// SECTION - Borrar producto del cart


export const deleteCartProduct = async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const cart = await cartController.findCartById(cid)
        const deleteProd = cart.products.filter(prod => prod.product.toString() !== pid)
        cart.products = deleteProd
        await cartController.updateCart(cid, cart)
        res.status(200).send(deleteProd)
    } catch (err) {
        logger.warning(`error al intentar borrar un producto del cart ${req.url}:\n ${err}`)
        return res.status(500).send('internal server error')
    }

}

// SECTION - actualizar quantity del producto


export const updateQuantity = async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const qty = req.body.qty
        const actualVal = req.body.actVal
        const cart = await cartController.findCartById(cid)
        const find = cart.products.findIndex(el => el.product.toString() === pid)
        cart.products[find].quantity = qty >= 0 ? qty : actualVal
        await cartController.updateCart(cid, cart)
        res.status(200).send(cart)
    } catch (err) {
        logger.warning(`error al actualizar la cantidad de productos del cart en ${req.url}:\n${err}`)
        return res.status(500).send('internal server error')
    }

}


// SECTION - vaciar el cart

export const emptyCart = async (req, res) => {
    try {
        const cid = req.params.cid
        const cart = await cartController.findCartById(cid)
        cart.products = []
        await cartController.updateCart(cid, cart)
        res.status(200).send(cart)
    } catch (err) {
        logger.warning(`error al intentar vaciar el cart en ${req.url}:\n${err}`)
        return res.status(500).send('internal server error')
    }

}