import ticketDAO from "../daos/ticket.dao.js"
import ticketRepository from "../repository/ticket.repository.js"

export const ticketController = new ticketRepository(ticketDAO)