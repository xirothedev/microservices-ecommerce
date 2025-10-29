import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import type {
  CreateProductRequest,
  GetProductRequest,
  Product,
  ProductList,
} from './interfaces/product.interface';

@Controller()
export class ProductController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern('product.create')
  createProduct(@Payload() data: CreateProductRequest): Product {
    console.log('Product Service - Received CreateProduct:', data);
    return this.productsService.create(data);
  }

  @MessagePattern('product.get')
  getProduct(@Payload() data: GetProductRequest): Product {
    console.log('Product Service - Received GetProduct:', data);
    return this.productsService.findOne(data.id);
  }

  @MessagePattern('product.getAll')
  getAllProducts(@Payload() _data: any): ProductList {
    console.log('Product Service - Received GetAllProducts:', _data);
    return { products: this.productsService.findAll() };
  }
}
