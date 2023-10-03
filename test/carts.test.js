import Assert from 'assert'
import chai from 'chai'
import mongoose from 'mongoose'
import config from "../src/env/config.js"
import supertest from 'supertest'
import cartModel from '../src/models/cart.model.js'
import userModel from '../src/models/user.model.js'
import logger from '../src/utils/logger.js'

const assert = Assert.strict
const expect = chai.expect
const mongourl = config.MONGOURL
const request = supertest('http://localhost:4040')

await mongoose.connect(mongourl)

describe('test de integracion - carts', async function () {
    let cookie = {}
    let cartId
    let productId

    it('el endpoint /auth debe iniciar sesion correctamente para obtener permisos', async function () {
         const user = {
            email: 'manumore42@gmail.com',
            password: '123'
        }
                const result = await request.post('/api/users/auth').send(user)
                const cookieResult = result.headers["set-cookie"][0]
                expect(cookieResult).to.be.ok

                cookie = {
                    name: cookieResult.split("=")[0],
                    value: cookieResult.split("=")[1],
                }
    })
+
    it('el endpoint api/carts/:cid debe poder agregar un producto al carro', async function(){
        const user = await userModel.findOne({email: "manumore42@gmail.com"})
        expect(user).to.exist
        cartId = user.cart
        productId = "64ff8cd521e0fce11eb79c01"
        const response = await request
        .put(`/api/carts/${cartId}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`])
        .send({prodId: productId})
        
        
        expect(response.status).to.equal(200)
    })

    it('el endpoint /:cid/products/:pid debe borrar el producto seleccionado del carro',async function(){
        const response = await request
        .delete(`/api/carts/${cartId}/products/${productId}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`])
        expect(response.status).to.equal(200)
    })

    it('el endpoint api/carts/:cid debe poder denegar agregar un producto al carro si el dueño lo creó', async function(){
        const user = await userModel.findOne({email: "manumore42@gmail.com"})
        expect(user).to.exist
        const cartId = user.cart
        const productToDelete = "64e67dc4d5c09367520b4125" // NOTE producto creado por el user
        const response = await request
        .put(`/api/carts/${cartId}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`])
        .send({prodId: productToDelete})
        expect(response.status).to.equal(400)
    })

    it('el endpoint /api/carts/:cid debe poder vaciar el carrito', async function(){
        const response = await request
        .delete(`/api/carts/${cartId}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`])
        expect(response.status).to.equal(200)
    })

})