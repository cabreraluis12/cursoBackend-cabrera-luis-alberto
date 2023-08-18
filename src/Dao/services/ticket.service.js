import { TicketModel } from "../models/ticket.model.js";

export class TicketService {
  static async generateTicket(cart, totalAmount, purchaserEmail) {
    try {
      console.log("Generating ticket...");

      const ticketCode = generateUniqueCode();

      const ticketData = {
        code: ticketCode,
        purchase_datetime: new Date(),
        amount: totalAmount,
        purchaser: purchaserEmail,
      };

      const newTicket = await TicketModel.create(ticketData);

      console.log("Ticket generated:", newTicket);

      return newTicket;
    } catch (error) {
      console.error("Error in generateTicket:", error.message);
      throw new Error("Error al generar el ticket");
    }
  }
}

  function generateUniqueCode() {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substr(2, 5);
    return `${timestamp}${randomPart}`.toUpperCase();
  }