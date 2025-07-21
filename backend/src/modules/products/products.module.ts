import { SupabaseService } from '@/supabase/supabase.service';
import { Module } from '@nestjs/common';
import { CategoriesService } from '../categories/categories.service';
import { ProductsController } from './products.controller';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, SupabaseService, ProductsResolver, CategoriesService],
})
export class ProductsModule {}
