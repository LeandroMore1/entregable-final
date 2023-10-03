import  productModel  from "../models/product.model.js";

class productsDAO{
    constructor(){
        this.model = productModel
    }

    async createMany(prod){
        return await this.model.insertMany(prod)
    }

    async get(){
        return await this.model.find().lean()
    }

    async create(product){
        return await this.model.create(product)
    }

    async getBy(param){
        return await this.model.findOne(param)
    }

    async delete(prodId){
        return await this.model.deleteOne( { _id: prodId } )
    }

    async update(id , prod){
        await this.model.findOneAndUpdate({ _id: id },{ $set: prod})
    }

    async getProductsByPagination(limit, page ,filter,sort){
        if(!sort){
            sort = {_id: 1}
        }
        return  this.model.paginate(filter, { limit: limit, page: page,sort: sort,lean: true})
    }

    
}

export const productDAO = new productsDAO()

export default productDAO 