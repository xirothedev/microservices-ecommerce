import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { DiscordModule } from '../discord/discord.module';
import { DiscordService } from '../discord/discord.service';

@Module({
  imports: [DiscordModule],
  controllers: [CustomersController],
  providers: [CustomersService, DiscordService],
})
export class CustomersModule {}
