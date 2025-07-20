/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
 

export enum ProductFlag {
  BEST_CHEAP = 'BEST_CHEAP',
  BEST_CHOICE = 'BEST_CHOICE',
  BEST_SELLER = 'BEST_SELLER',
  POPULAR = 'POPULAR',
}

export enum UserFlag {
  BANNED = 'BANNED',
  BEST_CUSTOMER = 'BEST_CUSTOMER',
  COPPER_CUSTOMER = 'COPPER_CUSTOMER',
  CUSTOMER = 'CUSTOMER',
  DIAMOND_CUSTOMER = 'DIAMOND_CUSTOMER',
  GOLD_CUSTOMER = 'GOLD_CUSTOMER',
  SILVER_CUSTOMER = 'SILVER_CUSTOMER',
}

export enum UserRole {
  ADMINISTRATOR = 'ADMINISTRATOR',
  COLLABORATOR = 'COLLABORATOR',
  ROOT = 'ROOT',
  SELLER = 'SELLER',
  SUPPORTER = 'SUPPORTER',
  USER = 'USER',
}

export class UpdateUserByAdmin {
  credit: number;
  flags: UserFlag[];
  roles: UserRole[];
}

export class UpdateUserInput {
  address: string;
  biography: string;
  city: string;
  fullname: string;
  state: string;
  zipCode: string;
}

export class CartItemQL {
  createAt: DateTime;
  id: string;
  product?: Nullable<ProductQL>;
  productId: string;
  quantity: number;
  unitPrice: number;
  updateAt: DateTime;
  userId: string;
}

export class CategoryQL {
  id: string;
  name: string;
  slug: string;
}

export abstract class IMutation {
  abstract updateUser(id: string, input: UpdateUserInput): UserQL | Promise<UserQL>;

  abstract updateUserByAdmin(id: string, input: UpdateUserByAdmin): UserQL | Promise<UserQL>;
}

export class ProductQL {
  averageRating: number;
  category?: Nullable<CategoryQL>;
  categoryId: string;
  createAt: DateTime;
  description: string;
  discountPrice: number;
  flags: ProductFlag[];
  id: string;
  isActive: boolean;
  medias: string[];
  name: string;
  originalPrice: number;
  sellerId: string;
  sku?: Nullable<string>;
  slug: string;
  sold: number;
  stock: number;
  tags: string[];
  updateAt: DateTime;
}

export abstract class IQuery {
  abstract me(): UserQL | Promise<UserQL>;

  abstract user(id: string): UserQL | Promise<UserQL>;
}

export class UserQL {
  address?: Nullable<string>;
  avatarUrl?: Nullable<string>;
  cart: CartItemQL[];
  city?: Nullable<string>;
  createAt: DateTime;
  credit: number;
  email: string;
  flags: UserFlag[];
  fullname: string;
  id: string;
  isVerified: boolean;
  phone?: Nullable<string>;
  roles: UserRole[];
  state?: Nullable<string>;
  updateAt: DateTime;
  zipCode?: Nullable<string>;
}

export type DateTime = any;
type Nullable<T> = T | null;
