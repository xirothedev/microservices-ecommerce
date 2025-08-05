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
import { WsAuthGuard } from './guards/ws-auth.guard';
import { TicketMessageResponse, TicketResponse } from './ticket.interface';
import { WsUser } from '@/common/decorators/ws-user.decorator';
import { TicketGatewayService } from './services/ticket-gateway.service';

@WebSocketGateway({ namespace: 'ticket', transports: ['websocket'] })
@UseGuards(WsAuthGuard)
export class TicketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger(TicketGateway.name);

  constructor(private readonly ticketGatewayService: TicketGatewayService) {}

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
    return this.ticketGatewayService.handleJoinTicketRoom(ticketId, client, user);
  }

  @SubscribeMessage('leave.ticket.room')
  async handleLeaveTicketRoom(@MessageBody() ticketId: string, @ConnectedSocket() client: Socket) {
    return this.ticketGatewayService.handleLeaveTicketRoom(ticketId, client);
  }

  broadcastNewTicket(ticket: TicketResponse) {
    this.logger.debug('📢 Broadcasting new ticket:', ticket.id);
    this.server.emit('ticket.new', ticket);
  }

  broadcastNewMessage(message: TicketMessageResponse) {
    const room = `ticket:${message.ticket.id}`;
    this.logger.debug(`📢 Broadcasting new message to room ${room}:`, message.id);
    this.logger.debug('📋 Message details:', JSON.stringify(message, null, 2));
    this.server.to(room).emit('ticket.message.new', message);
  }
}
