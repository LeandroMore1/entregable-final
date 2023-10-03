import userDAO from "../daos/user.dao.js"
import usersRepository from "../repository/user.repository.js"
import userManager from "../daos/file/userManager.js"
import config from "../env/config.js"

const persistence = config.PERSISTENCE || "mongodb"
let userController

if(persistence === "mongodb"){
    userController = new usersRepository(userDAO)
} else {
    userController = new usersRepository(userManager)
}

export {userController}