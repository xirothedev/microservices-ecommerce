"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import ChatInterface from "./chat-interface";
import {
	ArrowLeft,
	Calendar,
	Tag,
	AlertCircle,
	Clock,
	CheckCircle,
	XCircle,
	MessageCircle,
	FileText,
	Download,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

interface TicketDetailProps {
	ticketId: string;
}

interface TicketData {
	id: string;
	subject: string;
	description: string;
	category: string;
	priority: "low" | "medium" | "high" | "urgent";
	status: "open" | "in-progress" | "waiting" | "resolved" | "closed";
	createdAt: string;
	updatedAt: string;
	assignedAgent?: {
		name: string;
		avatar: string;
		email: string;
		status: "online" | "offline" | "away";
	};
	attachments: Array<{
		id: string;
		name: string;
		size: number;
		type: string;
		url: string;
	}>;
	contexts: Array<{
		type: string;
		id: string;
		label: string;
	}>;
}

// Mock ticket data
const mockTicketData: Record<string, TicketData> = {
	"TKT-123456": {
		id: "TKT-123456",
		subject: "Unable to access Apple ID Premium Setup",
		description:
			"I purchased the Apple ID Premium Setup service yesterday but I'm unable to access the setup instructions. When I try to log into my account, I get an error message saying 'Service not found'. I've tried clearing my browser cache and using different browsers but the issue persists. This is urgent as I need this for my business operations.",
		category: "technical",
		priority: "high",
		status: "in-progress",
		createdAt: "2024-01-15T10:30:00Z",
		updatedAt: "2024-01-15T14:22:00Z",
		assignedAgent: {
			name: "Sarah Johnson",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=40&width=40",
			email: "sarah.johnson@digitalpro.com",
			status: "online",
		},
		attachments: [
			{
				id: "att-1",
				name: "error-screenshot.png",
				size: 245760,
				type: "image/png",
				url: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=200&width=300",
			},
			{
				id: "att-2",
				name: "browser-console.png",
				size: 189440,
				type: "image/png",
				url: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=200&width=300",
			},
		],
		contexts: [
			{
				type: "order",
				id: "ORD-001",
				label: "Order #ORD-001 - Apple ID Premium Setup ($49.99)",
			},
			{
				type: "product",
				id: "PROD-001",
				label: "Apple ID Premium Setup",
			},
		],
	},
};

const statusConfig = {
	open: { icon: AlertCircle, color: "text-red-600", bg: "bg-red-100", label: "Open" },
	"in-progress": { icon: Clock, color: "text-blue-600", bg: "bg-blue-100", label: "In Progress" },
	waiting: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100", label: "Waiting" },
	resolved: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100", label: "Resolved" },
	closed: { icon: XCircle, color: "text-gray-600", bg: "bg-gray-100", label: "Closed" },
};

const priorityConfig = {
	low: { color: "text-gray-600", bg: "bg-gray-100" },
	medium: { color: "text-blue-600", bg: "bg-blue-100" },
	high: { color: "text-orange-600", bg: "bg-orange-100" },
	urgent: { color: "text-red-600", bg: "bg-red-100" },
};

const contextIcons = {
	order: "🛒",
	product: "📦",
	transaction: "💳",
	account: "👤",
};

export default function TicketDetail({ ticketId }: TicketDetailProps) {
	const [ticket, setTicket] = useState<TicketData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Simulate API call
		const loadTicket = async () => {
			setLoading(true);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setTicket(mockTicketData[ticketId] || null);
			setLoading(false);
		};

		loadTicket();
	}, [ticketId]);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	const getStatusIcon = (status: string) => {
		const config = statusConfig[status as keyof typeof statusConfig];
		const IconComponent = config.icon;
		return <IconComponent className={`h-4 w-4 ${config.color}`} />;
	};

	const getStatusBadge = (status: string) => {
		const config = statusConfig[status as keyof typeof statusConfig];
		return (
			<Badge variant="secondary" className={`${config.bg} ${config.color} border-0`}>
				{getStatusIcon(status)}
				<span className="ml-1">{config.label}</span>
			</Badge>
		);
	};

	const getPriorityBadge = (priority: string) => {
		const config = priorityConfig[priority as keyof typeof priorityConfig];
		return (
			<Badge variant="outline" className={`${config.bg} ${config.color} border-0 capitalize`}>
				{priority}
			</Badge>
		);
	};

	if (loading) {
		return (
			<div className="space-y-6">
				<div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
				<div className="grid gap-6 lg:grid-cols-3">
					<div className="space-y-6 lg:col-span-2">
						<div className="h-64 animate-pulse rounded bg-gray-200" />
						<div className="h-96 animate-pulse rounded bg-gray-200" />
					</div>
					<div className="space-y-6">
						<div className="h-48 animate-pulse rounded bg-gray-200" />
						<div className="h-32 animate-pulse rounded bg-gray-200" />
					</div>
				</div>
			</div>
		);
	}

	if (!ticket) {
		return (
			<div className="py-12 text-center">
				<AlertCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
				<h2 className="mb-2 text-xl font-semibold text-gray-900">Ticket Not Found</h2>
				<p className="mb-4 text-gray-600">
					The ticket you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
				</p>
				<Link href="/profile/tickets">
					<Button variant="outline">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Tickets
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
			className="space-y-6"
		>
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Link href="/profile/tickets">
						<Button variant="outline" size="sm">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Tickets
						</Button>
					</Link>
					<div>
						<h1 className="text-2xl font-bold text-gray-900">{ticket.subject}</h1>
						<p className="text-gray-600">Ticket #{ticket.id}</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					{getStatusBadge(ticket.status)}
					{getPriorityBadge(ticket.priority)}
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				{/* Main Content */}
				<div className="space-y-6 lg:col-span-2">
					{/* Ticket Details */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<FileText className="h-5 w-5" />
								Ticket Details
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<h4 className="mb-2 font-medium text-gray-900">Description</h4>
								<div className="prose prose-sm max-w-none text-gray-700">
									{ticket.description.split("\n").map((paragraph, index) => (
										<p key={index} className="mb-2">
											{paragraph}
										</p>
									))}
								</div>
							</div>

							{ticket.contexts.length > 0 && (
								<div>
									<h4 className="mb-2 font-medium text-gray-900">Referenced Items</h4>
									<div className="flex flex-wrap gap-2">
										{ticket.contexts.map((context, index) => (
											<Badge key={index} variant="outline" className="flex items-center gap-1">
												<span>{contextIcons[context.type as keyof typeof contextIcons]}</span>
												{context.label}
											</Badge>
										))}
									</div>
								</div>
							)}

							{ticket.attachments.length > 0 && (
								<div>
									<h4 className="mb-2 font-medium text-gray-900">Attachments</h4>
									<div className="space-y-2">
										{ticket.attachments.map((attachment) => (
											<div
												key={attachment.id}
												className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
											>
												<div className="flex items-center gap-3">
													<div className="flex h-8 w-8 items-center justify-center rounded bg-blue-100">
														<FileText className="h-4 w-4 text-blue-600" />
													</div>
													<div>
														<p className="text-sm font-medium text-gray-900">
															{attachment.name}
														</p>
														<p className="text-xs text-gray-500">
															{formatFileSize(attachment.size)}
														</p>
													</div>
												</div>
												<Button variant="ghost" size="sm">
													<Download className="h-4 w-4" />
												</Button>
											</div>
										))}
									</div>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Chat Interface */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<MessageCircle className="h-5 w-5" />
								Conversation
							</CardTitle>
							<CardDescription>Chat with our support team for real-time assistance</CardDescription>
						</CardHeader>
						<CardContent className="p-0">
							<ChatInterface ticketId={ticket.id} />
						</CardContent>
					</Card>
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Ticket Info */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Ticket Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center gap-2 text-sm">
								<Calendar className="h-4 w-4 text-gray-500" />
								<span className="text-gray-600">Created:</span>
								<span className="font-medium">{formatDate(ticket.createdAt)}</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<Clock className="h-4 w-4 text-gray-500" />
								<span className="text-gray-600">Updated:</span>
								<span className="font-medium">{formatDate(ticket.updatedAt)}</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<Tag className="h-4 w-4 text-gray-500" />
								<span className="text-gray-600">Category:</span>
								<Badge variant="outline" className="capitalize">
									{ticket.category.replace("-", " ")}
								</Badge>
							</div>
						</CardContent>
					</Card>

					{/* Assigned Agent */}
					{ticket.assignedAgent && (
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Assigned Agent</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex items-center gap-3">
									<div className="relative">
										<Avatar className="h-12 w-12">
											<AvatarImage
												src={
													ticket.assignedAgent.avatar ||
													"https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg"
												}
											/>
											<AvatarFallback>
												{ticket.assignedAgent.name
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
										<div
											className={`absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-white ${
												ticket.assignedAgent.status === "online"
													? "bg-green-500"
													: ticket.assignedAgent.status === "away"
														? "bg-yellow-500"
														: "bg-gray-400"
											}`}
										/>
									</div>
									<div>
										<p className="font-medium text-gray-900">{ticket.assignedAgent.name}</p>
										<p className="text-sm text-gray-600">{ticket.assignedAgent.email}</p>
										<p className="text-xs text-gray-500 capitalize">
											{ticket.assignedAgent.status}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Quick Actions */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Quick Actions</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<Button variant="outline" className="w-full justify-start bg-transparent">
								<Download className="mr-2 h-4 w-4" />
								Download Transcript
							</Button>
							<Button variant="outline" className="w-full justify-start bg-transparent">
								<FileText className="mr-2 h-4 w-4" />
								Print Ticket
							</Button>
							<Separator className="my-2" />
							<Button variant="destructive" className="w-full justify-start">
								<XCircle className="mr-2 h-4 w-4" />
								Close Ticket
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</motion.div>
	);
}
