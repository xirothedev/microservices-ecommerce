import { Product, User, CartItem } from "./backend";

export * from "../../../backend/prisma/generated";
export * from "../../../backend/src/typings/user";

export interface UserQuery extends Omit<User, "hashedPassword"> {}

export interface CartItemWithProduct extends CartItem {
	product: ProductWithCategory;
	productId: string;
}

export interface ProductWithCategory extends ProductWithAverageRating {
	category: Category;
}

export interface ProductWithAverageRating extends Product {
	averageRating: number;
}
