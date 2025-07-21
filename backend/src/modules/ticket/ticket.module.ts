import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketGateway } from './ticket.gateway';
import { TicketController } from './ticket.controller';
import { TicketEventListener } from './ticket.listener';

@Module({
  providers: [TicketGateway, TicketService, TicketEventListener],
  controllers: [TicketController],
})
export class TicketModule {}
