import { SupabaseService } from '@/supabase/supabase.service';
import { Module } from '@nestjs/common';
import { CartService } from '../cart/cart.service';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  providers: [UsersResolver, UsersService, SupabaseService, CartService],
})
export class UsersModule {}
