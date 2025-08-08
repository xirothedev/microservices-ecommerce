import { TicketContextType, TicketPriority, TicketCategory } from "@/@types/api/ticket";
import { z } from "zod";

export const ticketSchema = z.object({
	title: z.string().min(1, "Title is required").max(255, "Title must be at most 255 characters"),
	description: z.string().min(1, "Description is required"),
	category: z.enum(
		[
			TicketCategory.TECHNICAL_SUPPORT,
			TicketCategory.BILLING_PAYMENT,
			TicketCategory.ACCOUNT_ISSUE,
			TicketCategory.SERVICE_REQUEST,
			TicketCategory.REFUND_REQUEST,
			TicketCategory.GENERAL_INQUIRY,
		],
		"Ticket category is required",
	),
	priority: z.enum(
		[TicketPriority.URGENT, TicketPriority.HIGH, TicketPriority.MEDIUM, TicketPriority.LOW],
		"Ticket priority is required",
	),
	contexts: z
		.array(
			z.object({
				type: z.enum([
					TicketContextType.ORDER,
					TicketContextType.PRODUCT,
					TicketContextType.TRANSACTION,
					TicketContextType.ACCOUNT,
				]),
				labelId: z.string().min(1, "Context label id is required"),
				label: z.string().min(1, "Context label is required"),
			}),
		)
		.optional(),
	attachments: z.array(z.instanceof(File)).optional(),
});
export type TicketInput = z.infer<typeof ticketSchema>;
