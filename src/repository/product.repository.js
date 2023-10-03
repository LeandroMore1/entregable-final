export default class productRepository{
    constructor(dao){
        this.dao = dao
    }

    async addManyProducts(prod){
        return await this.dao.createMany(prod)
    }

    async getProducts(){
        return await this.dao.get()
    }

    async addProduct(product){
        return await this.dao.create(product)
    }

    async updateProduct(id,prod){
        return await this.dao.update(id,prod)
    }

    async findProductById(prodId){
        return await this.dao.getBy({_id:prodId})
    }

    async deleteProduct(prodId){
        return await this.dao.delete(prodId)
    }

    async getProductsByPagination(limit, page , filter,sort){
        return await this.dao.getProductsByPagination(limit, page, filter,sort)
         
    }
}   
