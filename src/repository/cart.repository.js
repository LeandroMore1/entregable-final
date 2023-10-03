export default class cartsRepository{
    constructor(dao){
        this.dao = dao
    }

    async getProductsInCart(id){
        return await this.dao.getProductsInCart(id)
    }

    async deleteCart(id){
        return await this.dao.delete(id)
    }
    
    async createCart(){
        return await this.dao.create()
    }

    async getCarts(){
        return await this.dao.get()
    }

    async updateCart(id, update){
        return await this.dao.update(id,update)
    }

    async findCartById(id){
        return await this.dao.getBy({ _id: id })
    }
}