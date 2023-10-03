import MyRouter from "./router.js"

export default class chatRouter extends MyRouter{
    init(){
        this.get('/' ,["USER"], async (req,res)=>{
            let user = req.user

            res.render('chat',{user})
        })
    }
}



