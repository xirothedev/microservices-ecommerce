// export default function ChangePasswordPage() {
//   return (
// 		// <main className="min-h-screen pt-16 bg-gray-50">
// 		//   <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// 		//     <div className="mb-8">
// 		//       <h1 className="text-3xl font-bold text-gray-900">Change Password</h1>
// 		//       <p className="text-gray-600 mt-2">Update your password to keep your account secure</p>
// 		//     </div>

// 		<ChangePasswordContent />
// 		// </div>
// 		// </main>
//   );
// }

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Eye, EyeOff, Shield, Check, X, AlertTriangle, CheckCircle, Lock, Key, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PasswordRequirement {
	rule: string;
	test: (password: string) => boolean;
	met: boolean;
}

export default function ChangePasswordContent() {
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
	const [isLoading, setIsLoading] = useState(false);

	// Password strength requirements
	const requirements: PasswordRequirement[] = [
		{ rule: "At least 8 characters long", test: (pwd) => pwd.length >= 8, met: false },
		{ rule: "Contains uppercase letter (A-Z)", test: (pwd) => /[A-Z]/.test(pwd), met: false },
		{ rule: "Contains lowercase letter (a-z)", test: (pwd) => /[a-z]/.test(pwd), met: false },
		{ rule: "Contains at least one number (0-9)", test: (pwd) => /\d/.test(pwd), met: false },
		{
			rule: "Contains special character (!@#$%^&*)",
			test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
			met: false,
		},
	];

	// Update requirements based on new password
	const updatedRequirements = requirements.map((req) => ({
		...req,
		met: req.test(passwords.new),
	}));

	// Calculate password strength
	const passwordStrength = updatedRequirements.filter((req) => req.met).length;
	const strengthPercentage = (passwordStrength / requirements.length) * 100;

	const getStrengthColor = () => {
		if (strengthPercentage < 40) return "bg-red-500";
		if (strengthPercentage < 70) return "bg-yellow-500";
		return "bg-green-500";
	};

	const getStrengthText = () => {
		if (strengthPercentage < 40) return "Weak";
		if (strengthPercentage < 70) return "Medium";
		return "Strong";
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors([]);
		setSuccess(false);
		setIsLoading(true);

		const newErrors: string[] = [];

		// Validate current password
		if (!passwords.current) {
			newErrors.push("Current password is required");
		}

		// Validate new password requirements
		if (!updatedRequirements.every((req) => req.met)) {
			newErrors.push("New password does not meet all requirements");
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
			setIsLoading(false);
			return;
		}

		// Simulate API call
		try {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			setSuccess(true);
			setPasswords({ current: "", new: "", confirm: "" });
		} catch (error) {
			setErrors(["Failed to update password. Please try again."]);
		} finally {
			setIsLoading(false);
		}
	};

	const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
		setShowPasswords((prev) => ({
			...prev,
			[field]: !prev[field],
		}));
	};

	return (
		<div className="space-y-6">
			{/* Main Password Change Form */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Lock className="h-5 w-5" />
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
									disabled={isLoading}
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="absolute top-0 right-0 h-full px-3"
									onClick={() => togglePasswordVisibility("current")}
									disabled={isLoading}
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
									disabled={isLoading}
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="absolute top-0 right-0 h-full px-3"
									onClick={() => togglePasswordVisibility("new")}
									disabled={isLoading}
								>
									{showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
								</Button>
							</div>
						</div>

						{/* Password Strength Indicator */}
						<AnimatePresence>
							{passwords.new && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									className="space-y-3"
								>
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<Label className="text-sm font-medium">Password Strength</Label>
											<span
												className={`text-sm font-medium ${
													strengthPercentage < 40
														? "text-red-600"
														: strengthPercentage < 70
															? "text-yellow-600"
															: "text-green-600"
												}`}
											>
												{getStrengthText()}
											</span>
										</div>
										<Progress value={strengthPercentage} className="h-2" />
									</div>

									<div className="grid grid-cols-1 gap-2 md:grid-cols-2">
										{updatedRequirements.map((requirement, index) => (
											<motion.div
												key={index}
												initial={{ opacity: 0, x: -10 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: index * 0.1 }}
												className="flex items-center gap-2 text-sm"
											>
												{requirement.met ? (
													<Check className="h-4 w-4 flex-shrink-0 text-green-600" />
												) : (
													<X className="h-4 w-4 flex-shrink-0 text-red-600" />
												)}
												<span className={requirement.met ? "text-green-600" : "text-red-600"}>
													{requirement.rule}
												</span>
											</motion.div>
										))}
									</div>
								</motion.div>
							)}
						</AnimatePresence>

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
									disabled={isLoading}
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="absolute top-0 right-0 h-full px-3"
									onClick={() => togglePasswordVisibility("confirm")}
									disabled={isLoading}
								>
									{showPasswords.confirm ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</Button>
							</div>
							{passwords.confirm && passwords.new !== passwords.confirm && (
								<p className="flex items-center gap-1 text-sm text-red-600">
									<X className="h-3 w-3" />
									Passwords do not match
								</p>
							)}
							{passwords.confirm && passwords.new === passwords.confirm && passwords.new && (
								<p className="flex items-center gap-1 text-sm text-green-600">
									<Check className="h-3 w-3" />
									Passwords match
								</p>
							)}
						</div>

						{/* Error Messages */}
						<AnimatePresence>
							{errors.length > 0 && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
								>
									<Alert className="border-red-200 bg-red-50">
										<AlertTriangle className="h-4 w-4" />
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
								</motion.div>
							)}
						</AnimatePresence>

						{/* Success Message */}
						<AnimatePresence>
							{success && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
								>
									<Alert className="border-green-200 bg-green-50">
										<CheckCircle className="h-4 w-4" />
										<AlertDescription className="text-green-700">
											Password updated successfully! Please use your new password for future
											logins.
										</AlertDescription>
									</Alert>
								</motion.div>
							)}
						</AnimatePresence>

						{/* Submit Button */}
						<Button
							type="submit"
							className="w-full"
							disabled={
								isLoading ||
								!updatedRequirements.every((req) => req.met) ||
								passwords.new !== passwords.confirm
							}
						>
							{isLoading ? "Updating Password..." : "Update Password"}
						</Button>
					</form>
				</CardContent>
			</Card>

			{/* Security Tips */}
			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Shield className="h-5 w-5" />
							Security Best Practices
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-3 text-sm">
							<li className="flex items-start gap-2">
								<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
								<span>Use a unique password for each account</span>
							</li>
							<li className="flex items-start gap-2">
								<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
								<span>Include a mix of letters, numbers, and symbols</span>
							</li>
							<li className="flex items-start gap-2">
								<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
								<span>Avoid personal information in passwords</span>
							</li>
							<li className="flex items-start gap-2">
								<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
								<span>Consider using a password manager</span>
							</li>
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Key className="h-5 w-5" />
							Additional Security
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
								<div className="flex items-center gap-3">
									<Smartphone className="h-5 w-5 text-blue-600" />
									<div>
										<p className="font-medium text-blue-900">Two-Factor Authentication</p>
										<p className="text-sm text-blue-700">Add an extra layer of security</p>
									</div>
								</div>
								<Button variant="outline" size="sm">
									Enable
								</Button>
							</div>

							<div className="text-sm text-gray-600">
								<p className="mb-2">
									We recommend enabling two-factor authentication for enhanced security.
								</p>
								<p>You'll receive a code on your phone each time you log in.</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
