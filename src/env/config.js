import dotenv from 'dotenv'
dotenv.config()

export default{
    PORT: process.env.PORT,
    MONGOURL: process.env.MONGOURL,
    SECRET: process.env.SECRET,
    COOKIETOKEN: process.env.COOKIETOKEN,
    PRIVATEKEY: process.env.PRIVATEKEY,
    CLIENTID: process.env.CLIENTID,
    CLIENTSECRET: process.env.CLIENTSECRET,
    ADMINMAIL: process.env.ADMINMAIL,
    ADMINPASSWORD: process.env.ADMINPASSWORD,
    ENVIROMENT: process.env.ENVIROMENT,
    WORKER_QTY: process.env.WORKER_QTY,
    PERSISTENCE: process.env.PERSISTENCE,
    SERVICE: process.env.SERVICE,
    NODEMAILER_EMAIL: process.env.NODEMAILER_EMAIL,
    NODEMAILER_PASSWORD: process.env.NODEMAILER_PASSWORD,
}