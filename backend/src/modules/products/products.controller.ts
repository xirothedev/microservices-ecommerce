import { Roles } from '@/common/decorators/role.decorator';
import { MediasInterceptor } from '@/common/interceptors/media.interceptor';
import { Body, Controller, Post, Req, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles('SELLER')
  @UseInterceptors(MediasInterceptor('medias'))
  create(@Req() req: Request, @Body() body: CreateProductDto, medias: Express.Multer.File[]) {
    return this.productsService.create(req, body, medias);
  }
}
