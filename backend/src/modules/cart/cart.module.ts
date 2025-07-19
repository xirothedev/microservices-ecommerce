import { SupabaseService } from '@/supabase/supabase.service';
import { Module } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { CartController } from './cart.controller';
import { CartResolver } from './cart.resolver';
import { CartService } from './cart.service';

@Module({
  controllers: [CartController],
  providers: [CartService, CartResolver, SupabaseService, ProductsService],
})
export class CartModule {}
