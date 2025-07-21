import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketGateway } from './ticket.gateway';
import { TicketController } from './ticket.controller';
import { TicketEventListener } from './ticket.listener';
import { SupabaseService } from '@/supabase/supabase.service';

@Module({
  providers: [TicketGateway, TicketService, TicketEventListener, SupabaseService],
  controllers: [TicketController],
})
export class TicketModule {}
