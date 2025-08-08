import type { LoginForm } from "@/zods/login";
import type { SignUpForm } from "@/zods/signup";
import { SafeUser } from "./user";

// Base API response interface
export interface ApiResponse<T> {
	message: string;
	data: T;
}

// Change password request
export interface ChangePasswordRequest {
	currentPassword: string;
	newPassword: string;
}

// Change password response
export interface ChangePasswordResponse extends ApiResponse<null> {}

// Login request (using existing LoginForm type)
export type LoginRequest = LoginForm;

// Login response (using existing SafeUser type)
export interface LoginResponse extends ApiResponse<SafeUser> {}

// Register request (using existing SignUpForm type)
export type RegisterRequest = SignUpForm;

// Register response (using existing SafeUser type)
export interface RegisterResponse extends ApiResponse<SafeUser> {}

// Refresh token response
export interface RefreshTokenResponse extends ApiResponse<null> {}

// Error response interface
export interface IAxiosError {
	response?: {
		data?: {
			message?: string | string[];
		};
		status?: number;
	};
}
