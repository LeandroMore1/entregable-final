import userModel from "../models/user.model.js";

class usersDAO{
    constructor(){
        this.model = userModel
    }

    async get(){
        return await this.model.find().lean()
    }

    async create(user){
        return await this.model.create(user)
    }

    async update(id, update){
        return await this.model.updateOne( {_id: id} , {$set: update})
    }

    async deleteBy(id){
        return await this.model.deleteOne(id)
    }

    async getBy(param){
        return await this.model.findOne(param).lean()
    }

}

const userDAO = new usersDAO()

export default userDAO