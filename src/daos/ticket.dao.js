import  ticketModel  from "../models/ticket.model.js";

class ticketsDAO{
    constructor(){
        this.model = ticketModel
    }
    async create(ticket){
        return await this.model.create(ticket)
    }

    async getBy(id){
        return await this.model.findOne(id).sort({purchase_dateTime: -1}).lean()
    }

}

export const ticketDAO = new ticketsDAO()

export default ticketDAO