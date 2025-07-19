import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { SupabaseService } from '@/supabase/supabase.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, SupabaseService],
  exports: [ProductsService],
})
export class ProductsModule {}
