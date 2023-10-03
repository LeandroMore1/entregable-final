import express from "express"
import handlebars from "express-handlebars"
import cookieParser from "cookie-parser";
import session from 'express-session';
import inicializePassport from "./config/passport.config.js";
import passport from "passport";
import MongoStore from 'connect-mongo'
import viewsRouter from "./routes/views.routers.js"
import cartRouter from "./routes/carts.router.js"
import userRouter from "./routes/user.router.js";
import sessionRouter from "./routes/sessions.router.js";
import chatRouter from "./routes/chat.router.js";
import mockingRouter from "./routes/mocking.router.js";
import productsRouter from "./routes/products.router.js";
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import mongoose from "mongoose"
import config from "./env/config.js";
import { addLogger } from "./utils/logger.js";




const app = express()
const privateKey = config.PRIVATEKEY
let messages = []


app.use(addLogger)
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: config.MONGOURL,
            mongoOptions: {
                useNewUrlParser: true,
            },
            ttl: 600,
        }),
        secret: config.SECRET,

        resave: true,

        saveUninitialized: true
    })
)
app.use(cookieParser(config.COOKIETOKEN));
inicializePassport()
app.use(passport.initialize())
app.use(passport.session())


await mongoose.connect(config.MONGOURL)

const swaggerOptions = {
    definition:{
        openapi:'3.0.1',
        info:{
        title:'Documentacion de proyecto CoderHouse',
        version:'1.0.0',
        description:'Documentacion de entidades cart y products',
        }
    },
    apis:['**/routes/*.js']
}

const spects = swaggerJsDoc(swaggerOptions);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser('tokenSecret'))

app.engine('handlebars', handlebars.engine())
app.set('views', "views/")
app.set('view engine', 'handlebars')



app.use('/', new viewsRouter().getRouter())
app.use('/apidocs',swaggerUi.serve,swaggerUi.setup(spects));
app.use('/api/carts', new cartRouter().getRouter())
app.use('/api/users', new userRouter().getRouter())
app.use('/api/sessions', new sessionRouter().getRouter())
app.use('/api/products',new productsRouter().getRouter())
app.use('/chat', new chatRouter().getRouter())
app.use('/api/mockingProducts', new mockingRouter().getRouter())

app.use(express.static('public'));


export default app