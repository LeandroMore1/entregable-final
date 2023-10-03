import nodemailer from 'nodemailer'
import config from '../env/config.js'

const user = config.NODEMAILER_EMAIL
const pass = config.NODEMAILER_PASSWORD
const service = config.SERVICE


export default class mailService{
    constructor (){
        this.client = nodemailer.createTransport({
            service: service,
            port: 465,
            secure: true,
            auth:{
                user: user,
                pass: pass
            }
        })
    }

    async sendMail(mailOptions){

        try{
            const result = await this.client.sendMail(mailOptions)
            return  result
        } catch(err){
            req.logger.error(err)
        }
       
    }
}