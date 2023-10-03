export default class ticketRepository{
    constructor(dao){
        this.dao = dao
    }

    async createTicket(ticket){
        return await this.dao.create(ticket)
    }

    async getTicketByEmail(email){
        return await this.dao.getBy({purchaser: email})
    }

    async getTicketById(id){
        return await this.dao.getBy({_id: id})
    }
}