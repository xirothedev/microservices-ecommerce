import { Logger, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { User } from '@prisma/generated';
import { Server, Socket } from 'socket.io';
import { WsUser } from './decorators/ws-user.decorator';
import { WsAuthGuard } from './guards/ws-auth.guard';
import { TicketMessageResponse, TicketResponse } from './ticket.interface';

@WebSocketGateway({ namespace: 'ticket', transports: ['websocket'] })
@UseGuards(WsAuthGuard)
export class TicketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger(TicketGateway.name);

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.logger.log(`[Connected] ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`[Disconnected] ${client.id}`);
  }

  @SubscribeMessage('join.ticket.room')
  async handleJoinTicketRoom(@MessageBody() ticketId: string, @ConnectedSocket() client: Socket, @WsUser() user: User) {
    const room = `ticket:${ticketId}`;
    this.logger.log(`User ${user.id} (${client.id}) joined room ${room}`);
    await client.join(room);
  }

  @SubscribeMessage('leave.ticket.room')
  async handleLeaveTicketRoom(@MessageBody() ticketId: string, @ConnectedSocket() client: Socket) {
    const room = `ticket:${ticketId}`;
    await client.leave(room);
  }

  broadcastNewTicket(ticket: TicketResponse) {
    this.logger.debug('📢 Broadcasting new ticket:', ticket.id);
    this.server.emit('ticket.new', ticket);
  }

  broadcastNewMessage(message: TicketMessageResponse) {
    const room = `ticket:${message.ticket.id}`;
    this.logger.debug(`📢 Broadcasting new message to room ${room}:`, message.id);
    this.logger.debug('📋 Message details:', {
      id: message.id,
      content: message.content,
      ticketId: message.ticket.id,
      sender: message.sender.user.fullname,
    });
    this.server.to(room).emit('ticket.message.new', message);
  }
}
