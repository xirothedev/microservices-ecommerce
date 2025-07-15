import { Roles } from '@/common/decorators/role.decorator';
import { MediasInterceptor } from '@/common/interceptors/media.interceptor';
import { Body, Controller, Post, Put, Get, Delete, Param, Req, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
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

  @Get('seller/:sellerId')
  findBySeller(@Param('sellerId') sellerId: string) {
    return this.productsService.findBySeller(sellerId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Put(':id')
  @Roles('SELLER')
  @UseInterceptors(MediasInterceptor('medias'))
  update(@Req() req: Request, @Param('id') id: string, @Body() body: UpdateProductDto, medias: Express.Multer.File[]) {
    return this.productsService.update(req, id, body, medias);
  }

  @Delete(':id')
  @Roles('SELLER')
  delete(@Req() req: Request, @Param('id') id: string) {
    return this.productsService.delete(req, id);
  }
}
