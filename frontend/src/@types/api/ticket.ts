import { z } from "zod";

export interface Ticket {
	id: string;
	numericalOrder: number;
	createdAt: string;
	updatedAt: string;
	title: string;
	description: string;
	status: TicketStatus;
	category: TicketCategory;
	priority: TicketPriority;
	contexts: TicketContext[];
	attachments: string[];
	authorId: string;
	assignId: string | null;
}

export interface TicketContext {
	id: string;
	type: TicketContextType;
	labelId: string;
	label: string;
	ticketId: string;
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
		lastActiveAt: string | null;
	};
	assign: {
		id: string;
		fullname: string;
		email: string;
		avatarUrl: string | null;
		lastActiveAt: string | null;
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
		author: { fullname: string; id: string; avatarUrl: string; lastActiveAt: string | null };
		assign: { fullname: string; id: string; avatarUrl: string; lastActiveAt: string | null } | null;
	};
	sender: {
		user: {
			id: string;
			fullname: string;
			avatarUrl: string | null;
			lastActiveAt: string | null;
		};
	};
}

export enum TicketStatus {
	RESOLVED = "RESOLVED",
	IN_PROGRESS = "IN_PROGRESS",
	WAITING = "WAITING",
	OPEN = "OPEN",
	CLOSED = "CLOSED",
}

export enum TicketCategory {
	TECHNICAL_SUPPORT = "TECHNICAL_SUPPORT",
	BILLING_PAYMENT = "BILLING_PAYMENT",
	ACCOUNT_ISSUE = "ACCOUNT_ISSUE",
	SERVICE_REQUEST = "SERVICE_REQUEST",
	REFUND_REQUEST = "REFUND_REQUEST",
	GENERAL_INQUIRY = "GENERAL_INQUIRY",
}

export enum TicketPriority {
	URGENT = "URGENT",
	HIGH = "HIGH",
	MEDIUM = "MEDIUM",
	LOW = "LOW",
}

export enum TicketContextType {
	ORDER = "ORDER",
	PRODUCT = "PRODUCT",
	TRANSACTION = "TRANSACTION",
	ACCOUNT = "ACCOUNT",
}

export interface Context extends Omit<TicketContext, "ticketId"> {}
export interface ContextInput extends Omit<TicketContext, "ticketId" | "id"> {}

export const ticketSchema = z.object({
	title: z.string().min(1, "Title is required").max(255, "Title must be at most 255 characters"),
	description: z.string().min(1, "Description is required"),
	category: z.enum(
		[
			"TECHNICAL_SUPPORT",
			"BILLING_PAYMENT",
			"ACCOUNT_ISSUE",
			"SERVICE_REQUEST",
			"REFUND_REQUEST",
			"GENERAL_INQUIRY",
		],
		"Ticket category is required",
	),
	priority: z.enum(["URGENT", "HIGH", "MEDIUM", "LOW"], "Ticket priority is required"),
	contexts: z
		.array(
			z.object({
				type: z.enum(["ORDER", "PRODUCT", "TRANSACTION", "ACCOUNT"]),
				labelId: z.string().min(1, "Context label id is required"),
				label: z.string().min(1, "Context label is required"),
			}),
		)
		.optional(),
});
export type TicketInput = z.infer<typeof ticketSchema>;
