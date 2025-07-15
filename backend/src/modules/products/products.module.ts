import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SupabaseService } from '@/supabase/supabase.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, SupabaseService],
})
export class ProductsModule {}
