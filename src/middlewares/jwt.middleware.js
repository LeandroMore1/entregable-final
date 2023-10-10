import jwt from "jsonwebtoken"
import config from "../env/config.js"
const privateKey = config.PRIVATEKEY

const generateToken = (user) => {
        return jwt.sign({user}, privateKey, {expiresIn: '5m'})
}

const setToken = (user) =>{
    return jwt.sign({user}, privateKey, {expiresIn: '1h'})
}

export {generateToken  , setToken }