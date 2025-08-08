"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/axios";
import { IAxiosError } from "@/@types";
import { Ticket, TicketCategory, TicketPriority } from "@/@types/api/ticket";
import { TicketInput, ticketSchema } from "@/zods/ticket";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, Loader2, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import ContextSelector from "./context-selector";
import ImageUpload from "./image-upload";
import RichTextEditor from "./rich-text-editor";

const categories: { value: TicketCategory; label: string }[] = [
	{ value: TicketCategory.TECHNICAL_SUPPORT, label: "Technical Support" },
	{ value: TicketCategory.BILLING_PAYMENT, label: "Billing & Payment" },
	{ value: TicketCategory.ACCOUNT_ISSUE, label: "Account Issues" },
	{ value: TicketCategory.SERVICE_REQUEST, label: "Service Request" },
	{ value: TicketCategory.REFUND_REQUEST, label: "Refund Request" },
	{ value: TicketCategory.GENERAL_INQUIRY, label: "General Inquiry" },
];

const priorities: { value: TicketPriority; label: string; description: string }[] = [
	{ value: TicketPriority.LOW, label: "Low", description: "General questions, non-urgent" },
	{ value: TicketPriority.MEDIUM, label: "Medium", description: "Standard support request" },
	{ value: TicketPriority.HIGH, label: "High", description: "Important issue affecting service" },
	{ value: TicketPriority.URGENT, label: "Urgent", description: "Critical issue, service down" },
];

export default function TicketForm() {
	const router = useRouter();
	const { mutateAsync, isError, isPending } = useMutation<{ data: Ticket }, void, TicketInput>({
		mutationFn: async (data: TicketInput) => {
			const response = await axiosInstance.post<{ data: Ticket }>("/ticket", data);
			return response.data;
		},
		onSuccess: (res) => {
			toast({
				title: "Success",
				description: "Ticket created successfully",
				variant: "default",
			});

			setTimeout(() => {
				router.push(`/profile/tickets/${res.data.id}`);
			}, 250);
		},
		onError: (error: unknown) => {
			const axiosError = error as IAxiosError;
			const message = axiosError?.response?.data?.message;
			toast({
				title: "Error",
				description: typeof message === "string" ? message : "An error occurred while creating ticket",
				variant: "destructive",
			});
		},
	});

	const form = useForm<TicketInput>({
		resolver: zodResolver(ticketSchema),
		defaultValues: {
			title: "",
			category: TicketCategory.GENERAL_INQUIRY,
			priority: TicketPriority.MEDIUM,
			description: "",
			contexts: [],
		},
	});

	const onSubmit = form.handleSubmit(async (data) => {
		await mutateAsync(data);
	});

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
					<form onSubmit={onSubmit} className="space-y-6">
						{/* Basic Information */}
						<div className="grid gap-6 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="title">
									Title <span className="text-red-500">*</span>
								</Label>
								<Input
									id="title"
									placeholder="Brief title of your issue"
									{...form.register("title")}
									aria-invalid={!!form.formState.errors.title}
									aria-describedby={form.formState.errors.title ? "title-error" : undefined}
								/>
								{form.formState.errors.title && (
									<p id="title-error" className="text-sm text-red-600">
										{form.formState.errors.title.message}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="category">
									Category <span className="text-red-500">*</span>
								</Label>
								<Controller
									control={form.control}
									name="category"
									render={({ field, fieldState }) => (
										<Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
											<SelectTrigger className={fieldState.error ? "border-red-500" : ""}>
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
									)}
								/>
								{form.formState.errors.category && (
									<p className="text-sm text-red-600">{form.formState.errors.category.message}</p>
								)}
							</div>
						</div>

						{/* Priority Selection */}
						<div className="space-y-2">
							<Label>Priority Level</Label>
							<Controller
								control={form.control}
								name="priority"
								render={({ field }) => (
									<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
										{priorities.map((priority) => (
											<button
												key={priority.value}
												type="button"
												onClick={() => field.onChange(priority.value)}
												disabled={isPending}
												className={`rounded-lg border p-3 text-left transition-all hover:shadow-sm ${
													field.value === priority.value
														? "border-blue-500 bg-blue-50"
														: "border-gray-200 hover:border-gray-300"
												} ${isPending ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
											>
												<div className="text-sm font-medium">{priority.label}</div>
												<div className="mt-1 text-xs text-gray-600">{priority.description}</div>
											</button>
										))}
									</div>
								)}
							/>
							{form.formState.errors.priority && (
								<p className="text-sm text-red-600">{form.formState.errors.priority.message}</p>
							)}
						</div>

						{/* Rich Text Editor */}
						<div className="space-y-2">
							<Label>
								Description <span className="text-red-500">*</span>
							</Label>
							<Controller
								control={form.control}
								name="description"
								render={({ field, fieldState }) => (
									<RichTextEditor
										value={field.value}
										onChange={field.onChange}
										placeholder="Describe your issue in detail. Include steps to reproduce, error messages, and any relevant information."
										disabled={isPending}
										error={fieldState.error?.message}
									/>
								)}
							/>
							{form.formState.errors.description && (
								<p className="text-sm text-red-600">{form.formState.errors.description.message}</p>
							)}
						</div>

						{/* Context Selector */}
						<div className="space-y-2">
							<Label>Reference Contexts (Optional)</Label>
							<Controller
								control={form.control}
								name="contexts"
								render={({ field }) => (
									<ContextSelector
										selectedContexts={field.value ?? []}
										onContextsChange={(contexts) => field.onChange(contexts.map((c) => c.label))}
										disabled={isPending}
									/>
								)}
							/>
						</div>

						{/* Image Upload */}
						<div className="space-y-2">
							<Label>Attachments (Optional)</Label>
							<Controller
								control={form.control}
								name="attachments"
								render={({ field }) => (
									<ImageUpload
										images={field.value ?? []}
										onImagesChange={field.onChange}
										disabled={isPending}
									/>
								)}
							/>
						</div>

						{/* Submission Progress */}
						<AnimatePresence>
							{isPending && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									className="space-y-3"
								>
									<div className="flex items-center gap-2">
										<Loader2 className="h-5 w-5 animate-spin text-blue-600" />
										<span className="text-sm font-medium">Submitting ticket...</span>
									</div>
									<Progress value={80} className="h-2" />
								</motion.div>
							)}
						</AnimatePresence>

						{/* Error Alert */}
						{isError && (
							<Alert className="border-red-200 bg-red-50">
								<AlertTriangle className="h-4 w-4" />
								<AlertDescription className="text-red-700">
									Please fix the errors above and try again.
								</AlertDescription>
							</Alert>
						)}

						{/* Submit Button */}
						<div className="flex justify-end pt-4">
							<Button type="submit" size="lg" disabled={isPending} className="flex items-center gap-2">
								{isPending ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin" />
										Processing...
									</>
								) : (
									<>
										<Send className="h-4 w-4" />
										Submit Ticket
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
