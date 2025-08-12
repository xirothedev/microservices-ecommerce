import { z } from "zod";

export const signUpSchema = z.object({
	email: z.string().email("Địa chỉ email không hợp lệ").min(1, "Email là bắt buộc"),

	fullname: z.string().min(1, "Họ và tên là bắt buộc"),

	password: z
		.string()
		.min(1, "Mật khẩu là bắt buộc")
		.min(8, "Mật khẩu phải có ít nhất 8 ký tự")
		.regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ cái viết hoa")
		.regex(/[a-z]/, "Mật khẩu phải chứa ít nhất một chữ cái viết thường")
		.regex(/[0-9]/, "Mật khẩu phải chứa ít nhất một số")
		.regex(/[^A-Za-z0-9]/, "Mật khẩu phải chứa ít nhất một ký tự đặc biệt"),
});

// Type inference
export type SignUpForm = z.infer<typeof signUpSchema>;
