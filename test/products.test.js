import Assert from 'assert'
import chai from 'chai'
import mongoose from 'mongoose'
import config from "../src/env/config.js"
import supertest from 'supertest'
import productModel from '../src/models/product.model.js'

const assert = Assert.strict
const expect = chai.expect
const mongourl = config.MONGOURL
const request = supertest('http://localhost:4040')

await mongoose.connect(mongourl)

describe('test de integracion - productos', async function () {

    let cookie = {}
    let product = {}


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


    it('el endpoint api/products/create debe crear un producto satisfactoriamente', async function () {


         product = {
            title: "bateria electrica",
            description: "bateria de percusion",
            price: 70000,
            stock: 15,
            code: 939,
            thumbnail: "url",
            category: "instruments"
        }

        await request
            .post('/api/products/create')
            .set("Cookie", [`${cookie.name}=${cookie.value}`])
            .send(product)
        
        const verify = await productModel.findOne({code: 939})    
        expect(verify).to.be.ok
        })


    it('el endpoint api/users/delete debe eliminar un producto satisfactoriamente', async function(){
        const deletedProd =  await productModel.findOne({code: 939})
        await request.delete('/api/products/delete').set("Cookie", [`${cookie.name}=${cookie.value}`]).send({prodToDel:deletedProd._id})

        const check = await productModel.findOne({code: 939})    
        expect(check).to.not.exist
    })

})





