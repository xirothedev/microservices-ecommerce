import axiosInstance from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
	ChangePasswordRequest,
	ChangePasswordResponse,
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	RegisterResponse,
	RefreshTokenResponse,
	IAxiosError,
} from "./types/auth";

class AuthApi {
	/**
	 * Change user password
	 */
	async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
		const response = await axiosInstance.post<ChangePasswordResponse>("/auth/change-password", data);
		return response.data;
	}

	/**
	 * Login user
	 */
	async login(data: LoginRequest): Promise<LoginResponse> {
		const response = await axiosInstance.post<LoginResponse>("/auth/login", data);
		return response.data;
	}

	/**
	 * Register new user
	 */
	async register(data: RegisterRequest): Promise<RegisterResponse> {
		const response = await axiosInstance.post<RegisterResponse>("/auth/register", data);
		return response.data;
	}

	/**
	 * Refresh access token
	 */
	async refreshToken(): Promise<RefreshTokenResponse> {
		const response = await axiosInstance.post<RefreshTokenResponse>("/auth/refresh-token");
		return response.data;
	}

	/**
	 * Logout user
	 */
	async logout(): Promise<void> {
		await axiosInstance.post("/auth/logout");
	}
}

// Export singleton instance
export const authApi = new AuthApi();

// Export individual methods for convenience
export const { changePassword, login, register, refreshToken, logout } = authApi;

// ============================================================================
// REACT HOOKS FOR AUTH
// ============================================================================

/**
 * Hook for user login with React Query
 */
export function useLogin() {
	const router = useRouter();
	return useMutation<LoginResponse, unknown, LoginRequest>({
		mutationFn: async (data: LoginRequest) => {
			const response = await axiosInstance.post<LoginResponse>("/auth/login", data);
			return response.data;
		},
		onSuccess: () => {
			toast({
				title: "Success",
				description: "Login successful, redirecting to services...",
				variant: "default",
			});
			// Wait for cookies to be set - consider increasing timeout for slower environments
			setTimeout(() => {
				router.push("/services");
			}, 250);
		},
		onError: (error: unknown) => {
			const axiosError = error as IAxiosError;
			const message = axiosError?.response?.data?.message;
			toast({
				title: "Error",
				description: typeof message === "string" ? message : "An error occurred during login",
				variant: "destructive",
			});
		},
	});
}

/**
 * Hook for user registration with React Query
 */
export function useSignup() {
	const router = useRouter();

	return useMutation<RegisterResponse, unknown, RegisterRequest>({
		mutationFn: async (data: RegisterRequest) => {
			const response = await axiosInstance.post<RegisterResponse>("/auth/register", data);
			return response.data;
		},
		onSuccess: () => {
			toast({
				title: "Success",
				description: "Register success, you will be pushed to the homepage",
				variant: "default",
			});
			setTimeout(() => router.push("/"), 2500);
		},
		onError: (error: unknown) => {
			const axiosError = error as IAxiosError;
			const message = axiosError?.response?.data?.message;
			toast({
				title: "Error",
				description: typeof message === "string" ? message : "An error occurred during registration",
				variant: "destructive",
			});
		},
	});
}

/**
 * Hook for changing password with React Query
 */
export function useChangePassword() {
	return useMutation<ChangePasswordResponse, unknown, ChangePasswordRequest>({
		mutationFn: async (data: ChangePasswordRequest) => {
			const response = await axiosInstance.post<ChangePasswordResponse>("/auth/change-password", data);
			return response.data;
		},
		onSuccess: () => {
			toast({
				title: "Success",
				description: "Password changed successfully!",
				variant: "default",
			});
		},
		onError: (error: unknown) => {
			const axiosError = error as IAxiosError;
			const message = axiosError?.response?.data?.message;
			let errorMessage = "Failed to change password. Please try again.";

			if (axiosError?.response?.status === 401) {
				errorMessage = "Current password is incorrect";
			} else if (axiosError?.response?.status === 400) {
				errorMessage = typeof message === "string" ? message : "Invalid request";
			} else if (axiosError?.response?.status === 404) {
				errorMessage = "User not found";
			}

			toast({
				title: "Error",
				description: errorMessage,
				variant: "destructive",
			});
		},
	});
}
