import jwt from "jsonwebtoken"
import passport from "passport"
import config from "../env/config.js"
const privateKey = config.PRIVATEKEY

const generateToken = (user) => {
        return jwt.sign({user}, privateKey, {expiresIn: '5m'})
}

const setToken = (user) =>{
    return jwt.sign({user}, privateKey, {expiresIn: '1h'})
}

const middlewarePassportJWT = async (req,res,next) => {
    passport.authenticate('jwt',{session:false}, (err,actualUser,info)=>{
        if(actualUser){
            req.user = actualUser
        }
        next()
    })(req,res,next)
}

export {generateToken , middlewarePassportJWT , setToken }