import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { WsAuthGuard } from './guards/ws-auth.guard';
import { TicketController } from './ticket.controller';
import { TicketGateway } from './ticket.gateway';
import { TicketEventListener } from './ticket.listener';
import { TicketService } from './ticket.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('ACCESS_TOKEN_SECRET_KEY'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [TicketGateway, TicketService, TicketEventListener, WsAuthGuard],
  controllers: [TicketController],
  exports: [TicketService],
})
export class TicketModule {}
