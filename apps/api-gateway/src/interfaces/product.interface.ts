import { Observable } from 'rxjs';

export type Empty = Record<string, never>;

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface GetProductRequest {
  id: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface ProductList {
  products: Product[];
}

export interface ProductService {
  CreateProduct(request: CreateProductRequest): Observable<Product>;
  GetProduct(request: GetProductRequest): Observable<Product>;
  GetAllProducts(request: Empty): Observable<ProductList>;
}
