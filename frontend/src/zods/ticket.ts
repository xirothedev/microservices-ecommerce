import { TicketContextType, TicketPriority, TicketCategory } from "@/@types/api/ticket";
import { z } from "zod";

export const ticketSchema = z.object({
	title: z.string().min(1, "Tiêu đề là bắt buộc").max(255, "Tiêu đề phải có tối đa 255 ký tự"),
	description: z.string().min(1, "Mô tả là bắt buộc"),
	category: z.enum(
		[
			TicketCategory.TECHNICAL_SUPPORT,
			TicketCategory.BILLING_PAYMENT,
			TicketCategory.ACCOUNT_ISSUE,
			TicketCategory.SERVICE_REQUEST,
			TicketCategory.REFUND_REQUEST,
			TicketCategory.GENERAL_INQUIRY,
		],
		"Danh mục phiếu hỗ trợ là bắt buộc",
	),
	priority: z.enum(
		[TicketPriority.URGENT, TicketPriority.HIGH, TicketPriority.MEDIUM, TicketPriority.LOW],
		"Mức độ ưu tiên phiếu hỗ trợ là bắt buộc",
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
				labelId: z.string().min(1, "ID nhãn ngữ cảnh là bắt buộc"),
				label: z.string().min(1, "Nhãn ngữ cảnh là bắt buộc"),
			}),
		)
		.optional(),
	attachments: z.array(z.instanceof(File)).optional(),
});
export type TicketInput = z.infer<typeof ticketSchema>;
