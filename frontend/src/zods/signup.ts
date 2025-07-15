import { z } from "zod";

export const signUpSchema = z.object({
	email: z.string().email("Invalid email address").min(1, "Email is required"),

	fullname: z.string().min(1, "Full name is required"),

	password: z
		.string()
		.min(1, "Password is required")
		.min(8, "Password must be at least 8 characters")
		.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
		.regex(/[a-z]/, "Password must contain at least one lowercase letter")
		.regex(/[0-9]/, "Password must contain at least one number")
		.regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

// Type inference
export type SignUpForm = z.infer<typeof signUpSchema>;
