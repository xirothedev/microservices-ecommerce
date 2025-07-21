import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { DiscordModule } from '../discord/discord.module';

@Module({
  imports: [DiscordModule],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
