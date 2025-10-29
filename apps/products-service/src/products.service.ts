import { Injectable } from '@nestjs/common';
import { CreateProductRequest, Product } from './interfaces/product.interface';

@Injectable()
export class ProductsService {
  private products: Product[] = [];
  private nextId = 1;

  create(createProductRequest: CreateProductRequest): Product {
    const product: Product = {
      id: this.nextId.toString(),
      name: createProductRequest.name,
      description: createProductRequest.description,
      price: createProductRequest.price,
      category: createProductRequest.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.products.push(product);
    this.nextId++;

    return product;
  }

  findOne(id: string): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }
    return product;
  }

  findAll(): Product[] {
    return this.products;
  }
}
