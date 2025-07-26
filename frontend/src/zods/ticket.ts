import { z } from "zod";

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
