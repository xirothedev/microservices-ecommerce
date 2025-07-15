import { Roles } from '@/common/decorators/role.decorator';
import { MediasInterceptor } from '@/common/interceptors/media.interceptor';
import { Body, Controller, Post, Put, Get, Delete, Param, Req, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles('SELLER')
  @UseInterceptors(MediasInterceptor('medias'))
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiBody({ type: CreateProductDto })
  create(@Req() req: Request, @Body() body: CreateProductDto, medias: Express.Multer.File[]) {
    return this.productsService.create(req, body, medias);
  }

  @Get('seller/:sellerId')
  @ApiOperation({ summary: 'Get all products by seller' })
  @ApiParam({ name: 'sellerId', type: String })
  @ApiResponse({ status: 200, description: 'List of products' })
  findBySeller(@Param('sellerId') sellerId: string) {
    return this.productsService.findBySeller(sellerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Product detail' })
  findById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Put(':id')
  @Roles('SELLER')
  @UseInterceptors(MediasInterceptor('medias'))
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  update(@Req() req: Request, @Param('id') id: string, @Body() body: UpdateProductDto, medias: Express.Multer.File[]) {
    return this.productsService.update(req, id, body, medias);
  }

  @Delete(':id')
  @Roles('SELLER')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  delete(@Req() req: Request, @Param('id') id: string) {
    return this.productsService.delete(req, id);
  }
}
