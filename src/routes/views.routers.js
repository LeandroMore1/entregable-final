
import { products } from "../controllers/product.controller.js";
import { userController } from "../service/user.service.js";
import { productController } from "../service/product.service.js";
import config from "../env/config.js";
import { isGuest } from "../middlewares/auth.middleware.js";
import MyRouter from "./router.js";
import jwt from "jsonwebtoken"
import logger from "../utils/logger.js";
import usersDTO from "../dto/users.dto.js";
export default class viewsRouter extends MyRouter {
    init() {

        /**
        * @swagger
        * components:
        *   schemas:
        *     Products:
        *       type: object
        *       properties:
        *         _id:
        *           type: string
        *           description: Id de Mongo.
        *         title:
        *           type: string
        *           description: Título del producto.
        *         description:
        *           type: string
        *           description: Descripción del producto.
        *         price:
        *           type: number
        *           description: Precio del producto.
        *         code:
        *           type: number
        *           description: Código del producto.
        *         stock:
        *           type: number
        *           description: Stock del producto.
        *         thumbnail:
        *           type: string
        *           description: Dirección de imagen del producto
        *         category:
        *           type: string
        *           description: Categoría del producto.
        *         owner:
        *           type: string
        *           description: Creador del producto (email)
        *       example:
        *         _id: ObjectId("asfdnsi1413241kn31rkn")
        *         title: guitarra eléctrica
        *         description: guitarra stratocaster marca fender
        *         price: 200000
        *         thumbnail: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQgSDLvM3eeqxUFUW-1i9K0WQWA7v0OlHW8Q3RHcRVsUzOCfKWrThohgA_1JcAP1BX4o3-Jl7dedNC1pr2QlZUCk37QVGcmUBt82Ub_jMF_wy00yqAJH7dN&usqp=CAE"
        *         code: 464
        *         category: instruments
        *         stock: 10
        *         owner: fulano@detal.com
        */

        // SECTION - obtener products (con documentación)

        this.get('/products', ["PUBLIC"], products)

        /**
        * @swagger
        * paths:
        *   /products:
        *     get:
        *       summary: Obtiene los productos
        *       tags:
        *         - Products
        *       responses:
        *         '200':
        *           description: Lista de productos
        *           content:
        *             application/json:
        *               schema:
        *                 type: array
        *                 items:
        *                   $ref: '#/components/schemas/Products'
        *         '500':
        *           description: Error del servidor
        */


        // SECTION - vista de login

        this.get('/login', ["PUBLIC"], isGuest, (req, res) => {
            res.render('login', { title: "Iniciar Sesión" })
        })


        // SECTION - vista private

        this.get('/current', ["ADMIN", "USER", "PREMIUM"], (req, res) => {
            try {
                const token = req.cookies.token
                const user = jwt.verify(token, config.PRIVATEKEY)
                res.status(200).send({ message: 'Private route', user: user });
            } catch (err) {
                req.logger.error(`error en ${req.url}: \n${err}`)
            }
        })


        // SECTION - vista de perfil

        this.get('/profile', ["ADMIN", "USER", "PREMIUM"], async (req, res) => {
            try {
                const getUser = req.user
                let user = await userController.getUserByEmail(getUser.email)
                if (user.role === "admin") {
                    user.role = null
                }
                res.render('profile', {
                    title: `Mi Perfil | ${user.name}`,
                    user: user
                })
            } catch (err) {
                req.logger.warning(`error en ${req.url}: \n${err}`)
            }
        })


        // SECTION - vista del register

        this.get('/register', ["PUBLIC"], isGuest, (req, res) => {
            res.render('register', { title: "Registrarse" })
        })


        // SECTION - obtener y renderizar productos en home.handlebars

        this.get("/", ["PUBLIC"], async (req, res) => {
            try {
                const products = await productController.getProducts()
                res.render('home', { products })
            } catch (err) {
                req.logger.warning(`error en ${req.url}: \n${err}`)
            }
        })


        // SECTION - vista mail para recuperacion de password

        this.get('/recoveryMail', ["PUBLIC"], isGuest, async (req, res) => {
            try {
                const oldToken = req.cookies.restoreToken
                if (oldToken) {
                    res.clearCookie("restoreToken")
                }
                res.render('sendRecovery', { title: 'restablecer contraseña' })
            } catch (err) {
                req.logger.error(err)
            }
        })


        // SECTION - vista restablecer contraseña

        this.get('/restorePassword/:tok', ["PUBLIC"], isGuest, async (req, res) => {
            try{
                const token = req.params.tok
                const tokenTime = jwt.decode(token)
    
                logger.debug(JSON.stringify(tokenTime))
                
                const baseUrl = req.protocol + '://' + req.get('host');
    
                if (Date.now() >= tokenTime.exp * 1000) {
                    res.redirect(`${baseUrl}/recoveryMail`)
                }
                res.render('restorePassword', { token: token })
            } catch (err){
                logger.error(err)
            }
        })


        // SECTION - obtener, crear, eliminar y actualizar productos

        this.get("/realtimeproducts", ["ADMIN", "PREMIUM"], async(req, res) => {
            let user = req.user
            user = await userController.getUserById(user._id)
            res.render('realTimeProducts', { user })
        })


        // SECTION - mostrar el test de logger

        this.get('/loggerTest', ["PUBLIC"], (req, res) => {
            req.logger.fatal('test de logger: fatal')
            req.logger.error('test de logger: error')
            req.logger.warning('test de logger: warning')
            req.logger.info('test de logger: info')
            req.logger.http('test de logger: http')
            req.logger.debug('test de logger: debug')
            res.send('prueba logger')
        })

        // SECTION - vista del admin

        this.get('/admin', ['ADMIN'], async (req, res) => {
            try {
                setTimeout(async () => {
                    let user = req.user
                    user = await userController.getUserById(user._id)
                    let users = await userController.getUsers()
                    users = users.filter(el => { return el.role !== "admin" })
                    users = new usersDTO(users)

                    res.render('admin', { title: 'panel del admin', user, users: users.users })
                }, 2000)

            } catch (err) {
                logger.error(`error al intentar obtener la vista del admin en: ${req.url}:\n${err}`)
                return res.status(500).send('internal server error')
            }
        })

    }


}
