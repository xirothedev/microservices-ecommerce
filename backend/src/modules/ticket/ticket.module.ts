import { Module } from '@nestjs/common';
import { WsAuthGuard } from './guards/ws-auth.guard';
import { TicketController } from './ticket.controller';
import { TicketGateway } from './ticket.gateway';
import { TicketEventListener } from './ticket.listener';
import { TicketService } from './ticket.service';

@Module({
  providers: [TicketGateway, TicketService, TicketEventListener, WsAuthGuard],
  controllers: [TicketController],
  exports: [TicketService],
})
export class TicketModule {}
