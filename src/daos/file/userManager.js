import fs from "fs"
import logger from "../../utils/logger.js"

export default class userManager{
    constructor() {
        this.path = "./users.json"
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, JSON.stringify([]))
        }
    }

    id = 0

    async get(){
        const users = await fs.promises.readFile(this.path)
        return users
    }

    async create(newUser){
        let user = await this.get();
        if (!user) {
            user = []
        }
        let lastId = user.length > 0 ? user[user.length - 1].id : 0;
        let newId = lastId + 1
        newUser.id = newId
        await user.push(newUser)
        await fs.promises.writeFile(this.path, JSON.stringify(user))
    }
    
    async getBy(id){
        const users = await this.get()
        let found = await users.findIndex(el => el.id === id)
        if(found === -1){
            return false
        } else{
            const userFound = await users[found]
            return userFound
        }
    }

    async deleteBy(id){
        let users = await this.get()
        let userId = await users.findIndex(el => el.id === id)

        if (userId !== -1) {
            await users.splice(userId, 1)
            await fs.promises.writeFile(this.path, JSON.stringify(users))
            return logger.info(`producto con id ${id} borrado existosamente`)
        } else {
            return logger.error("el producto no existe o ha sido borrado")
        }
    }
}