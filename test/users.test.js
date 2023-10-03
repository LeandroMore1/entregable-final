import logger from '../src/utils/logger.js'
import Assert from 'assert'
import chai from 'chai'
import mongoose from 'mongoose'
import config from "../src/env/config.js"
import supertest from 'supertest'
import userModel from '../src/models/user.model.js'

const assert = Assert.strict
const expect = chai.expect
const mongourl = config.MONGOURL
const request = supertest('http://localhost:4040')

await mongoose.connect(mongourl)

describe('test de integracion - usuarios', async function () {

    let cookie = {}
    let user = {}

    it('el endpoint /api/users/ debe poder registrarse correctamente', async function(){
        const newUser = {
            name: "Cosme",
            lastName: "Fulanito",
            email: "cosmeFulanito@mail.com",
            age: 40,
            password: "123",
            img: 'exampleimage'
        }
        const response = await request
        .post('/api/users/')
        .send(newUser)

        const user = await userModel.findOne({email:"cosmeFulanito@mail.com"})
        expect(response.status).to.equal(302)
        expect(user).to.exist

        await userModel.deleteOne({email:"cosmeFulanito@mail.com"})

    })

    it('el endpoint debe iniciar sesion correctamente en /api/users/auth', async function () {
        user = {
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

    it('el usuario debe de poder cambiar su rol a premium o a user en /api/users/premium/:uid', async function(){
        user = await userModel.findOne({email: user.email})
        const oldRole = user.role
        const id = user._id
        let newRole = "premium"
        if(user.role === "premium"){
            newRole = "user"
        } else {
            newRole = "premium"
        }
        const response = await request
        .put(`/api/users/premium/${id}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`])
        .send({role: newRole})
        const result =  await userModel.findOne({email: user.email})
        expect(response.status).to.equal(200)
        expect(result.role).to.not.be.equal(oldRole)
    })

    it('en caso de estar logeado, el user debe poder acceder a la vista /current', async function(){
        const response = await request
        .get('/current')
        .set("Cookie", [`${cookie.name}=${cookie.value}`])
        expect(response.status).to.equal(200)
        const { user } = response.body;
        expect(user).to.exist
    })



    it('el user puede desloguearse correctamente en /api/users/logout',async function(){
        const response = await request
        .post('/api/users/logout')
        .set("Cookie", [`${cookie.name}=${cookie.value}`])
        expect(response.header).to.not.have.property('token')
        expect(response.status).to.equal(302) // chequeo que se haya hecho el redirect

    })

})