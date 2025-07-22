import { z } from "zod";

export const ticketSchema = z.object({
	title: z.string().min(1, "Title is required").min(5, "Title must be at least 5 characters"),
	description: z.string().min(1, "Description is required").min(20, "Description must be at least 20 characters"),
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
	priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"], "Ticket priority is required"),
	referenceContext: z.array(z.string()).optional(),
});
export type TicketInput = z.infer<typeof ticketSchema>;
