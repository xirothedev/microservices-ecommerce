import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/axios";
import { fetchGraphQL } from "@/lib/fetchGraphQL";
import type { IAxiosError } from "@/typings";
import type { SafeUser } from "@/typings/backend";
import type { LoginForm } from "@/zods/login";
import type { SignUpForm } from "@/zods/signup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useUser() {
	return useQuery({
		queryKey: [],
		queryFn: () =>
			fetchGraphQL(`
        query Me {
          me {
            address
            avatarUrl
            city
            createAt
            credit
            email
            flags
            fullname
            id
            isVerified
            phone
            roles
            state
            updateAt
            zipCode
          }
        }
      `),
		staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
	});
}

export function useLogin() {
	const router = useRouter();
	return useMutation<{ data: SafeUser }, void, LoginForm>({
		mutationFn: async (data: LoginForm) => {
			const response = await axiosInstance.post<{ data: SafeUser }>("/auth/login", data);
			return response.data;
		},
		onSuccess: () => {
			toast({
				title: "Success",
				description: "Login successful, redirecting to dashboard...",
				variant: "default",
			});
			// Wait for cookies to be set - consider increasing timeout for slower environments
			setTimeout(() => {
				router.push("/dashboard");
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

export function useSignup() {
	const router = useRouter();

	return useMutation<{ data: SafeUser }, void, SignUpForm>({
		mutationFn: async (data: SignUpForm) => {
			const response = await axiosInstance.post<{ data: SafeUser }>("/auth/register", data);
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
