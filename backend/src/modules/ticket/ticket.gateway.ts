import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TicketMessageResponse, TicketResponse } from './ticket.interface';

@WebSocketGateway()
export class TicketGateway {
  @WebSocketServer()
  server: Server;

  broadcastNewTicket(ticket: TicketResponse) {
    this.server.emit('ticket.new', ticket);
  }

  broadcastNewMessage(message: TicketMessageResponse) {
    this.server.emit('ticket.message.new', message);
  }
}
