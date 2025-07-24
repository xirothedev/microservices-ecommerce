import z from "zod";

export const profileSchema = z.object({
	fullname: z.string().min(1, "Full name is required"),
	address: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	zipCode: z.string().optional(),
	biography: z.string().optional(),
});

export type ProfileForm = z.infer<typeof profileSchema>;
