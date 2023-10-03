export default class usersRepository{
    constructor(dao){
        this.dao = dao
    }

    async getUsers(){
        return await this.dao.get()
    }

    async updateUser(id, update){
        return await this.dao.update(id,update)
    }

    async createUser(user){
        return await this.dao.create(user)
    }

    async getUserById(id){
        return await this.dao.getBy({_id: id})
    }

    async deleteUserById(id){
        return await this.dao.deleteBy({_id: id})
    }

    async getUserByEmail(mail){
        return await this.dao.getBy({email: mail})
    }
}