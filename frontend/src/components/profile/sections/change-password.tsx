"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Shield, Check, X } from "lucide-react";
import { motion } from "motion/react";

export default function ChangePassword() {
	const [showPasswords, setShowPasswords] = useState({
		current: false,
		new: false,
		confirm: false,
	});

	const [passwords, setPasswords] = useState({
		current: "",
		new: "",
		confirm: "",
	});

	const [errors, setErrors] = useState<string[]>([]);
	const [success, setSuccess] = useState(false);

	// Password validation rules
	const passwordRules = [
		{ rule: "At least 8 characters", test: (pwd: string) => pwd.length >= 8 },
		{ rule: "Contains uppercase letter", test: (pwd: string) => /[A-Z]/.test(pwd) },
		{ rule: "Contains lowercase letter", test: (pwd: string) => /[a-z]/.test(pwd) },
		{ rule: "Contains number", test: (pwd: string) => /\d/.test(pwd) },
		{ rule: "Contains special character", test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
	];

	const validatePassword = (password: string) => {
		return passwordRules.map((rule) => ({
			...rule,
			valid: rule.test(password),
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setErrors([]);
		setSuccess(false);

		const newErrors: string[] = [];

		// Validate current password (in real app, this would be verified server-side)
		if (!passwords.current) {
			newErrors.push("Current password is required");
		}

		// Validate new password
		const passwordValidation = validatePassword(passwords.new);
		if (!passwordValidation.every((rule) => rule.valid)) {
			newErrors.push("New password does not meet requirements");
		}

		// Validate password confirmation
		if (passwords.new !== passwords.confirm) {
			newErrors.push("New passwords do not match");
		}

		// Check if new password is different from current
		if (passwords.current === passwords.new) {
			newErrors.push("New password must be different from current password");
		}

		if (newErrors.length > 0) {
			setErrors(newErrors);
			return;
		}

		// Simulate API call
		setTimeout(() => {
			setSuccess(true);
			setPasswords({ current: "", new: "", confirm: "" });
		}, 1000);
	};

	const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
		setShowPasswords((prev) => ({
			...prev,
			[field]: !prev[field],
		}));
	};

	const passwordValidation = validatePassword(passwords.new);

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Shield className="h-5 w-5" />
						Change Password
					</CardTitle>
					<CardDescription>
						Update your password to keep your account secure. Choose a strong password that you haven't used
						before.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Current Password */}
						<div className="space-y-2">
							<Label htmlFor="current-password">Current Password</Label>
							<div className="relative">
								<Input
									id="current-password"
									type={showPasswords.current ? "text" : "password"}
									value={passwords.current}
									onChange={(e) => setPasswords((prev) => ({ ...prev, current: e.target.value }))}
									placeholder="Enter your current password"
									className="pr-10"
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="absolute top-0 right-0 h-full px-3"
									onClick={() => togglePasswordVisibility("current")}
								>
									{showPasswords.current ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</Button>
							</div>
						</div>

						{/* New Password */}
						<div className="space-y-2">
							<Label htmlFor="new-password">New Password</Label>
							<div className="relative">
								<Input
									id="new-password"
									type={showPasswords.new ? "text" : "password"}
									value={passwords.new}
									onChange={(e) => setPasswords((prev) => ({ ...prev, new: e.target.value }))}
									placeholder="Enter your new password"
									className="pr-10"
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="absolute top-0 right-0 h-full px-3"
									onClick={() => togglePasswordVisibility("new")}
								>
									{showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
								</Button>
							</div>
						</div>

						{/* Password Requirements */}
						{passwords.new && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								className="space-y-2"
							>
								<Label className="text-sm font-medium">Password Requirements</Label>
								<div className="grid grid-cols-1 gap-2 md:grid-cols-2">
									{passwordValidation.map((rule, index) => (
										<div key={index} className="flex items-center gap-2 text-sm">
											{rule.valid ? (
												<Check className="h-4 w-4 text-green-600" />
											) : (
												<X className="h-4 w-4 text-red-600" />
											)}
											<span className={rule.valid ? "text-green-600" : "text-red-600"}>
												{rule.rule}
											</span>
										</div>
									))}
								</div>
							</motion.div>
						)}

						{/* Confirm Password */}
						<div className="space-y-2">
							<Label htmlFor="confirm-password">Confirm New Password</Label>
							<div className="relative">
								<Input
									id="confirm-password"
									type={showPasswords.confirm ? "text" : "password"}
									value={passwords.confirm}
									onChange={(e) => setPasswords((prev) => ({ ...prev, confirm: e.target.value }))}
									placeholder="Confirm your new password"
									className="pr-10"
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="absolute top-0 right-0 h-full px-3"
									onClick={() => togglePasswordVisibility("confirm")}
								>
									{showPasswords.confirm ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</Button>
							</div>
							{passwords.confirm && passwords.new !== passwords.confirm && (
								<p className="text-sm text-red-600">Passwords do not match</p>
							)}
						</div>

						{/* Error Messages */}
						{errors.length > 0 && (
							<Alert className="border-red-200 bg-red-50">
								<AlertDescription>
									<ul className="list-inside list-disc space-y-1">
										{errors.map((error, index) => (
											<li key={index} className="text-red-700">
												{error}
											</li>
										))}
									</ul>
								</AlertDescription>
							</Alert>
						)}

						{/* Success Message */}
						{success && (
							<Alert className="border-green-200 bg-green-50">
								<AlertDescription className="text-green-700">
									Password updated successfully! Please use your new password for future logins.
								</AlertDescription>
							</Alert>
						)}

						{/* Submit Button */}
						<Button type="submit" className="w-full">
							Update Password
						</Button>
					</form>
				</CardContent>
			</Card>

			{/* Security Tips */}
			<Card>
				<CardHeader>
					<CardTitle>Security Tips</CardTitle>
					<CardDescription>Keep your account secure with these best practices</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-3">
							<h4 className="font-semibold text-gray-900">Password Best Practices</h4>
							<ul className="space-y-2 text-sm text-gray-600">
								<li className="flex items-start gap-2">
									<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
									Use a unique password for each account
								</li>
								<li className="flex items-start gap-2">
									<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
									Include a mix of letters, numbers, and symbols
								</li>
								<li className="flex items-start gap-2">
									<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
									Avoid personal information in passwords
								</li>
							</ul>
						</div>
						<div className="space-y-3">
							<h4 className="font-semibold text-gray-900">Additional Security</h4>
							<ul className="space-y-2 text-sm text-gray-600">
								<li className="flex items-start gap-2">
									<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
									Enable two-factor authentication
								</li>
								<li className="flex items-start gap-2">
									<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
									Use a password manager
								</li>
								<li className="flex items-start gap-2">
									<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
									Regularly update your passwords
								</li>
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
