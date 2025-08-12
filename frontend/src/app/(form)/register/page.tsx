"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useSignup } from "@/lib/api/auth";
import { cn } from "@/lib/utils";
import type { SignUpForm } from "@/zods/signup";
import { signUpSchema } from "@/zods/signup";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconBrandDiscord, IconBrandGoogle } from "@tabler/icons-react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BottomGradient } from "../components/bottom-gradient";
import { LabelInputContainer } from "../components/label-input-container";

export default function SignupPage() {
	const [passwordStrength, setPasswordStrength] = useState(0);
	const { mutateAsync, isPending } = useSignup();

	const form = useForm<SignUpForm>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: "",
			fullname: "",
			password: "",
		},
	});

	const calculatePasswordStrength = (password: string) => {
		let strength = 0;
		if (password.length >= 8) strength += 1;
		if (/[A-Z]/.test(password)) strength += 1;
		if (/[a-z]/.test(password)) strength += 1;
		if (/[0-9]/.test(password)) strength += 1;
		if (/[^A-Za-z0-9]/.test(password)) strength += 1;
		return strength;
	};

	const onSubmit = async (data: SignUpForm) => {
		await mutateAsync(data);
	};

	const handleSocialLogin = async (provider: "discord" | "google") => {
		try {
			window.open(`${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}/login`);
		} catch {
			toast({
				title: "Lỗi",
				description: "Đã xảy ra lỗi trong quá trình đăng nhập xã hội",
				variant: "destructive",
			});
		}
	};

	return (
		<div className="shadow-input relative mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black/75">
			<div className="mb-8">
				<Link href="/" className="text-muted-foreground hover:text-foreground flex items-center text-sm">
					<ArrowLeft className="mr-2 h-4 w-4" />
					Quay về trang chủ
				</Link>
			</div>

			<h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Chào mừng đến với Digital Pro</h2>
			<p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
				Đăng ký nếu bạn có thể vì chúng tôi chưa có luồng đăng ký
			</p>

			<form className="my-8 text-black dark:text-white" onSubmit={form.handleSubmit(onSubmit)}>
				{Object.keys(form.formState.errors).length > 0 && (
					<div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3" role="alert">
						<div className="text-sm text-red-600">
							{Object.entries(form.formState.errors).map(([field, error]) => (
								<div key={field}>{error?.message}</div>
							))}
						</div>
					</div>
				)}
				<LabelInputContainer className="mb-4">
					<Label htmlFor="fullname">Họ và tên</Label>
					<Input
						id="fullname"
						placeholder="John Smith"
						type="text"
						{...form.register("fullname")}
						aria-invalid={!!form.formState.errors.fullname}
						aria-describedby={form.formState.errors.fullname ? "fullname-error" : undefined}
					/>
				</LabelInputContainer>
				<LabelInputContainer className="mb-4">
					<Label htmlFor="email">Địa chỉ Email</Label>
					<Input
						id="email"
						placeholder="xiro@theterminal.com"
						type="email"
						{...form.register("email")}
						aria-invalid={!!form.formState.errors.email}
						aria-describedby={form.formState.errors.email ? "email-error" : undefined}
					/>
				</LabelInputContainer>
				<LabelInputContainer className="mb-4">
					<Label htmlFor="password">Mật khẩu</Label>
					<Input
						id="password"
						placeholder="••••••••"
						type="password"
						{...form.register("password", {
							onChange: (e) => setPasswordStrength(calculatePasswordStrength(e.target.value)),
						})}
						aria-invalid={!!form.formState.errors.password}
						aria-describedby={form.formState.errors.password ? "password-error" : undefined}
					/>
					{form.watch("password") && (
						<div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-200">
							<div
								className={cn(
									"h-full transition-all duration-300",
									passwordStrength <= 2 && "bg-red-500",
									passwordStrength === 3 && "bg-yellow-500",
									passwordStrength >= 4 && "bg-green-500",
								)}
								style={{ width: `${(passwordStrength / 5) * 100}%` }}
							/>
						</div>
					)}
				</LabelInputContainer>

				<Button
					className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
					type="submit"
					disabled={isPending}
				>
					{isPending ? "Đang đăng ký..." : "Đăng ký"}
					<BottomGradient />
				</Button>

				<div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

				<div className="flex flex-col space-y-4">
					<Button
						className="group/btn hover:bg-bg-gray-50 shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
						type="button"
						onClick={() => handleSocialLogin("discord")}
						disabled={isPending}
					>
						<IconBrandDiscord className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
						<span className="text-sm text-neutral-700 dark:text-neutral-300">Discord</span>
						<BottomGradient />
					</Button>
					<Button
						className="group/btn hover:bg-bg-gray-50 shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
						type="button"
						onClick={() => handleSocialLogin("google")}
						disabled={isPending}
					>
						<IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
						<span className="text-sm text-neutral-700 dark:text-neutral-300">Google</span>
						<BottomGradient />
					</Button>

					<div className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-300">
						Đã có tài khoản?{" "}
						<Link href="/login" className="text-blue-600 hover:underline dark:text-blue-400">
							Đăng nhập
						</Link>
					</div>
				</div>
			</form>
		</div>
	);
}
