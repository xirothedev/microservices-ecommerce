"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import RichTextEditor from "./rich-text-editor";
import ImageUpload from "./image-upload";
import ContextSelector from "./context-selector";
import { Send, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TicketFormData {
	subject: string;
	category: string;
	priority: string;
	description: string;
	images: File[];
	contexts: Array<{
		type: string;
		id: string;
		label: string;
	}>;
}

type SubmissionStep = "idle" | "validating" | "uploading" | "submitting" | "success" | "error";

export default function TicketForm() {
	const [formData, setFormData] = useState<TicketFormData>({
		subject: "",
		category: "",
		priority: "medium",
		description: "",
		images: [],
		contexts: [],
	});

	const [submissionStep, setSubmissionStep] = useState<SubmissionStep>("idle");
	const [submissionProgress, setSubmissionProgress] = useState(0);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [ticketId, setTicketId] = useState<string>("");

	const categories = [
		{ value: "technical", label: "Technical Support" },
		{ value: "billing", label: "Billing & Payment" },
		{ value: "account", label: "Account Issues" },
		{ value: "service", label: "Service Request" },
		{ value: "refund", label: "Refund Request" },
		{ value: "general", label: "General Inquiry" },
	];

	const priorities = [
		{ value: "low", label: "Low", description: "General questions, non-urgent" },
		{ value: "medium", label: "Medium", description: "Standard support request" },
		{ value: "high", label: "High", description: "Important issue affecting service" },
		{ value: "urgent", label: "Urgent", description: "Critical issue, service down" },
	];

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.subject.trim()) {
			newErrors.subject = "Subject is required";
		} else if (formData.subject.length < 5) {
			newErrors.subject = "Subject must be at least 5 characters";
		}

		if (!formData.category) {
			newErrors.category = "Please select a category";
		}

		if (!formData.description.trim()) {
			newErrors.description = "Description is required";
		} else if (formData.description.length < 20) {
			newErrors.description = "Description must be at least 20 characters";
		}

		if (formData.images.length > 5) {
			newErrors.images = "Maximum 5 images allowed";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const simulateSubmission = async (): Promise<void> => {
		// Simulate validation
		setSubmissionStep("validating");
		setSubmissionProgress(10);
		await new Promise((resolve) => setTimeout(resolve, 500));

		if (!validateForm()) {
			setSubmissionStep("error");
			return;
		}

		// Simulate image upload
		if (formData.images.length > 0) {
			setSubmissionStep("uploading");
			setSubmissionProgress(30);

			for (let i = 0; i < formData.images.length; i++) {
				await new Promise((resolve) => setTimeout(resolve, 800));
				setSubmissionProgress(30 + ((i + 1) / formData.images.length) * 40);
			}
		}

		// Simulate ticket submission
		setSubmissionStep("submitting");
		setSubmissionProgress(80);
		await new Promise((resolve) => setTimeout(resolve, 1000));

		setSubmissionProgress(100);
		setTicketId(`TKT-${Date.now().toString().slice(-6)}`);
		setSubmissionStep("success");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});
		await simulateSubmission();
	};

	const resetForm = () => {
		setFormData({
			subject: "",
			category: "",
			priority: "medium",
			description: "",
			images: [],
			contexts: [],
		});
		setSubmissionStep("idle");
		setSubmissionProgress(0);
		setErrors({});
		setTicketId("");
	};

	const getStepMessage = (): string => {
		switch (submissionStep) {
			case "validating":
				return "Validating ticket information...";
			case "uploading":
				return "Uploading images...";
			case "submitting":
				return "Submitting your ticket...";
			case "success":
				return "Ticket submitted successfully!";
			case "error":
				return "Please fix the errors and try again";
			default:
				return "";
		}
	};

	if (submissionStep === "success") {
		return (
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
			>
				<Card className="text-center">
					<CardContent className="p-8">
						<CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-600" />
						<h2 className="mb-2 text-2xl font-bold text-gray-900">Ticket Submitted Successfully!</h2>
						<p className="mb-4 text-gray-600">
							Your support ticket has been created with ID: <strong>{ticketId}</strong>
						</p>
						<p className="mb-6 text-sm text-gray-500">
							You will receive an email confirmation shortly. Our support team will respond within 2
							hours.
						</p>
						<div className="flex justify-center gap-4">
							<Button onClick={resetForm} variant="outline">
								Submit Another Ticket
							</Button>
							<Button onClick={() => (window.location.href = "/profile")}>View My Tickets</Button>
						</div>
					</CardContent>
				</Card>
			</motion.div>
		);
	}

	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
			<Card>
				<CardHeader>
					<CardTitle>Create Support Ticket</CardTitle>
					<CardDescription>
						Provide detailed information about your issue to help us assist you better
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Basic Information */}
						<div className="grid gap-6 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="subject">
									Subject <span className="text-red-500">*</span>
								</Label>
								<Input
									id="subject"
									placeholder="Brief description of your issue"
									value={formData.subject}
									onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
									className={errors.subject ? "border-red-500" : ""}
									disabled={submissionStep !== "idle"}
								/>
								{errors.subject && <p className="text-sm text-red-600">{errors.subject}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="category">
									Category <span className="text-red-500">*</span>
								</Label>
								<Select
									value={formData.category}
									onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
									disabled={submissionStep !== "idle"}
								>
									<SelectTrigger className={errors.category ? "border-red-500" : ""}>
										<SelectValue placeholder="Select category" />
									</SelectTrigger>
									<SelectContent>
										{categories.map((category) => (
											<SelectItem key={category.value} value={category.value}>
												{category.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
							</div>
						</div>

						{/* Priority Selection */}
						<div className="space-y-2">
							<Label>Priority Level</Label>
							<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
								{priorities.map((priority) => (
									<button
										key={priority.value}
										type="button"
										onClick={() => setFormData((prev) => ({ ...prev, priority: priority.value }))}
										disabled={submissionStep !== "idle"}
										className={`rounded-lg border p-3 text-left transition-all hover:shadow-sm ${
											formData.priority === priority.value
												? "border-blue-500 bg-blue-50"
												: "border-gray-200 hover:border-gray-300"
										} ${submissionStep !== "idle" ? "cursor-not-allowed opacity-50" : ""}`}
									>
										<div className="text-sm font-medium">{priority.label}</div>
										<div className="mt-1 text-xs text-gray-600">{priority.description}</div>
									</button>
								))}
							</div>
						</div>

						{/* Rich Text Editor */}
						<div className="space-y-2">
							<Label>
								Description <span className="text-red-500">*</span>
							</Label>
							<RichTextEditor
								value={formData.description}
								onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
								placeholder="Describe your issue in detail. Include steps to reproduce, error messages, and any relevant information."
								disabled={submissionStep !== "idle"}
								error={errors.description}
							/>
							{errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
						</div>

						{/* Context Selector */}
						<div className="space-y-2">
							<Label>Reference Context (Optional)</Label>
							<ContextSelector
								selectedContexts={formData.contexts}
								onContextsChange={(contexts) => setFormData((prev) => ({ ...prev, contexts }))}
								disabled={submissionStep !== "idle"}
							/>
						</div>

						{/* Image Upload */}
						<div className="space-y-2">
							<Label>Attachments (Optional)</Label>
							<ImageUpload
								images={formData.images}
								onImagesChange={(images) => setFormData((prev) => ({ ...prev, images }))}
								disabled={submissionStep !== "idle"}
								error={errors.images}
							/>
							{errors.images && <p className="text-sm text-red-600">{errors.images}</p>}
						</div>

						{/* Submission Progress */}
						<AnimatePresence>
							{!["idle", "success"].includes(submissionStep) && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									className="space-y-3"
								>
									<div className="flex items-center gap-2">
										{submissionStep === "error" ? (
											<AlertTriangle className="h-5 w-5 text-red-600" />
										) : (
											<Loader2 className="h-5 w-5 animate-spin text-blue-600" />
										)}
										<span className="text-sm font-medium">{getStepMessage()}</span>
									</div>
									{submissionStep !== "error" && (
										<Progress value={submissionProgress} className="h-2" />
									)}
								</motion.div>
							)}
						</AnimatePresence>

						{/* Error Alert */}
						{Object.keys(errors).length > 0 && submissionStep === "error" && (
							<Alert className="border-red-200 bg-red-50">
								<AlertTriangle className="h-4 w-4" />
								<AlertDescription className="text-red-700">
									Please fix the errors above and try again.
								</AlertDescription>
							</Alert>
						)}

						{/* Submit Button */}
						<div className="flex justify-end pt-4">
							<Button
								type="submit"
								size="lg"
								disabled={submissionStep !== "idle"}
								className="flex items-center gap-2"
							>
								{submissionStep === "idle" ? (
									<>
										<Send className="h-4 w-4" />
										Submit Ticket
									</>
								) : (
									<>
										<Loader2 className="h-4 w-4 animate-spin" />
										Processing...
									</>
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</motion.div>
	);
}
