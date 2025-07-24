import { Module } from '@nestjs/common';
import { CartService } from '../cart/cart.service';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersResolver, UsersService, CartService],
})
export class UsersModule {}
