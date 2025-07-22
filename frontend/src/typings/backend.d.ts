import { TicketContext, TicketCategory, TicketPriority, TicketStatus } from "./backend";
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

export interface TicketResponse {
	id: string;
	createAt: string;
	updateAt: string;
	numericalOrder: number;
	title: string;
	description: string;
	status: TicketStatus;
	category: TicketCategory;
	priority: TicketPriority;
	contexts: TicketContext[];
	attachments: string[];
	author: {
		id: string;
		fullname: string;
		email: string;
		avatarUrl: string | null;
	};
	assigned: {
		id: string;
		fullname: string;
		email: string;
		avatarUrl: string | null;
	} | null;
	_count: {
		messages: number;
	};
}
