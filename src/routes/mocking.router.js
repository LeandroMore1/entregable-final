import MyRouter from "./router.js"
import { productController } from "../service/product.service.js"
import { testFunction } from "../utils/generateProducts.js"


export default class mockingRouter extends MyRouter{
    init(){
        this.post('/',["PUBLIC"], async (req,res)=>{
            try{
                let test = testFunction()
                await productController.addManyProducts(test)
                res.json(test);
            } catch (err){
                req.logger.error(err)
            }
        })
    }
}