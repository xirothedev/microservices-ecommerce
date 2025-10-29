export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface GetProductRequest {
  id: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductList {
  products: Product[];
}

export type Empty = Record<string, never>;
