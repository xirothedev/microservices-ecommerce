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
	createdAt: string;
	updatedAt: string;
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
	assign: {
		id: string;
		fullname: string;
		email: string;
		avatarUrl: string | null;
	} | null;
	_count: {
		messages: number;
	};
}

export interface TicketMessageResponse {
	id: string;
	content: string;
	isRead: boolean;
	createdAt: string;
	updatedAt: string;
	attachments: string[];
	ticket: {
		id: string;
		author: { fullname: string; id: string; avatarUrl: string };
		assign: { fullname: string; id: string; avatarUrl: string };
	};
	sender: {
		user: {
			id: string;
			fullname: string;
			avatarUrl: string | null;
		};
	};
}

export interface Context extends Omit<TicketContext, "ticketId"> {}
export interface ContextInput extends Omit<TicketContext, "ticketId" | "id"> {}
