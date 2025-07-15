"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
	AlertCircle,
	Calendar,
	CheckCircle,
	Clock,
	Download,
	FileText,
	Paperclip,
	Send,
	User,
	XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type TicketStatus = "open" | "in-progress" | "waiting" | "resolved" | "closed";

interface Ticket {
	id: string;
	subject: string;
	description: string;
	category: string;
	priority: "low" | "medium" | "high" | "urgent";
	status: TicketStatus;
	createdAt: string;
	updatedAt: string;
	user: {
		id: string;
		name: string;
		email: string;
		avatar: string;
	};
	assignedAgent?: {
		id: string;
		name: string;
		avatar: string;
		email: string;
		status: "online" | "offline" | "away";
	};
	attachments: number;
}

interface Message {
	id: string;
	content: string;
	sender: {
		id: string;
		name: string;
		avatar: string;
		type: "user" | "agent";
	};
	timestamp: string;
	attachments?: Array<{
		id: string;
		name: string;
		url: string;
		type: string;
	}>;
	isRead: boolean;
}

interface AdminChatInterfaceProps {
	ticket: Ticket | null;
	isOpen: boolean;
	onClose: () => void;
}

// Mock messages data
const mockMessages: Message[] = [
	{
		id: "msg-1",
		content:
			"I purchased the Apple ID Premium Setup service yesterday but I'm unable to access the setup instructions. When I try to log into my account, I get an error message saying 'Service not found'.",
		sender: {
			id: "user-1",
			name: "John Doe",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
			type: "user",
		},
		timestamp: "2024-01-15T10:30:00Z",
		attachments: [
			{
				id: "att-1",
				name: "error-screenshot.png",
				url: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=200&width=300",
				type: "image/png",
			},
		],
		isRead: true,
	},
	{
		id: "msg-2",
		content:
			"Hello John! Thank you for contacting us. I'm Sarah and I'll be helping you with your Apple ID Premium Setup issue. I can see that you've attached a screenshot of the error. Let me investigate this for you right away.",
		sender: {
			id: "agent-1",
			name: "Sarah Johnson",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
			type: "agent",
		},
		timestamp: "2024-01-15T10:35:00Z",
		isRead: true,
	},
	{
		id: "msg-3",
		content:
			"I've checked your account and I can see the purchase was successful. The issue seems to be related to a temporary sync problem with our service activation system. I'm going to manually activate your service now.",
		sender: {
			id: "agent-1",
			name: "Sarah Johnson",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
			type: "agent",
		},
		timestamp: "2024-01-15T10:42:00Z",
		isRead: true,
	},
	{
		id: "msg-4",
		content:
			"Great! I can now see the setup instructions in my account. However, I'm having trouble with step 3 - the verification code isn't being sent to my email.",
		sender: {
			id: "user-1",
			name: "John Doe",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
			type: "user",
		},
		timestamp: "2024-01-15T11:15:00Z",
		isRead: true,
	},
];

export default function AdminChatInterface({ ticket, isOpen, onClose }: AdminChatInterfaceProps) {
	const [messages, setMessages] = useState<Message[]>(mockMessages);
	const [newMessage, setNewMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [ticketStatus, setTicketStatus] = useState(ticket?.status || "open");
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (ticket) {
			setTicketStatus(ticket.status);
		}
	}, [ticket]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	if (!ticket) return null;

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

	const formatTime = (timestamp: string) => {
		const date = new Date(timestamp);
		return date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		});
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

	const handleSendMessage = async () => {
		if (!newMessage.trim()) return;

		setIsLoading(true);

		const agentMessage: Message = {
			id: `msg-${Date.now()}`,
			content: newMessage,
			sender: {
				id: "agent-1",
				name: "Sarah Johnson",
				avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
				type: "agent",
			},
			timestamp: new Date().toISOString(),
			isRead: true,
		};

		setMessages((prev) => [...prev, agentMessage]);
		setNewMessage("");

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 500));
		setIsLoading(false);
	};

	const handleStatusChange = async (newStatus: TicketStatus) => {
		setIsLoading(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setTicketStatus(newStatus);
		setIsLoading(false);
	};

	const handleFileUpload = () => {
		fileInputRef.current?.click();
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-h-[90vh] max-w-6xl overflow-hidden">
				<DialogHeader>
					<DialogTitle>Support Ticket Chat</DialogTitle>
					<DialogDescription>Communicate with the customer and manage ticket status</DialogDescription>
				</DialogHeader>

				<div className="grid h-[70vh] grid-cols-1 gap-6 lg:grid-cols-3">
					{/* Chat Interface */}
					<div className="flex flex-col lg:col-span-2">
						{/* Chat Header */}
						<div className="flex items-center justify-between rounded-t-lg border-b bg-gray-50 p-4">
							<div className="flex items-center gap-3">
								<Avatar className="h-8 w-8">
									<AvatarImage
										src={
											ticket.user.avatar ||
											"https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg"
										}
									/>
									<AvatarFallback className="text-xs">
										{ticket.user.name
											.split(" ")
											.map((n) => n[0])
											.join("")}
									</AvatarFallback>
								</Avatar>
								<div>
									<div className="font-medium">{ticket.user.name}</div>
									<div className="text-sm text-gray-600">{ticket.user.email}</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								{getStatusBadge(ticketStatus)}
								{getPriorityBadge(ticket.priority)}
							</div>
						</div>

						{/* Messages */}
						<ScrollArea className="flex-1 p-4">
							<div className="space-y-4">
								{messages.map((message, index) => (
									<motion.div
										key={message.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.3, delay: index * 0.1 }}
										className={`flex gap-3 ${message.sender.type === "agent" ? "justify-end" : "justify-start"}`}
									>
										{message.sender.type === "user" && (
											<Avatar className="h-8 w-8">
												<AvatarImage
													src={
														message.sender.avatar ||
														"https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg"
													}
												/>
												<AvatarFallback className="text-xs">
													{message.sender.name
														.split(" ")
														.map((n) => n[0])
														.join("")}
												</AvatarFallback>
											</Avatar>
										)}
										<div
											className={`max-w-[70%] ${message.sender.type === "agent" ? "order-2" : ""}`}
										>
											<div
												className={`rounded-lg p-3 ${
													message.sender.type === "agent"
														? "bg-blue-600 text-white"
														: "bg-gray-100 text-gray-900"
												}`}
											>
												<p className="text-sm">{message.content}</p>
												{message.attachments && message.attachments.length > 0 && (
													<div className="mt-2 space-y-1">
														{message.attachments.map((attachment) => (
															<div
																key={attachment.id}
																className="flex items-center gap-2 text-xs"
															>
																<FileText className="h-3 w-3" />
																<span>{attachment.name}</span>
															</div>
														))}
													</div>
												)}
											</div>
											<div
												className={`mt-1 text-xs text-gray-500 ${
													message.sender.type === "agent" ? "text-right" : "text-left"
												}`}
											>
												{formatTime(message.timestamp)}
											</div>
										</div>
										{message.sender.type === "agent" && (
											<Avatar className="order-3 h-8 w-8">
												<AvatarImage
													src={
														message.sender.avatar ||
														"https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg"
													}
												/>
												<AvatarFallback className="text-xs">
													{message.sender.name
														.split(" ")
														.map((n) => n[0])
														.join("")}
												</AvatarFallback>
											</Avatar>
										)}
									</motion.div>
								))}
							</div>
							<div ref={messagesEndRef} />
						</ScrollArea>

						{/* Message Input */}
						<div className="border-t p-4">
							<div className="flex gap-2">
								<div className="flex-1">
									<Textarea
										placeholder="Type your response..."
										value={newMessage}
										onChange={(e) => setNewMessage(e.target.value)}
										onKeyPress={handleKeyPress}
										className="min-h-[60px] resize-none"
										disabled={ticketStatus === "closed"}
									/>
								</div>
								<div className="flex flex-col gap-2">
									<Button
										variant="outline"
										size="icon"
										onClick={handleFileUpload}
										disabled={ticketStatus === "closed"}
									>
										<Paperclip className="h-4 w-4" />
									</Button>
									<Button
										onClick={handleSendMessage}
										disabled={!newMessage.trim() || isLoading || ticketStatus === "closed"}
									>
										<Send className="h-4 w-4" />
									</Button>
								</div>
							</div>
							<input
								ref={fileInputRef}
								type="file"
								className="hidden"
								multiple
								accept="image/*,.pdf,.doc,.docx,.txt"
							/>
						</div>
					</div>

					{/* Ticket Details Sidebar */}
					<div className="space-y-4">
						{/* Ticket Info */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Ticket Details</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<div className="mb-1 text-sm font-medium text-gray-900">Ticket ID</div>
									<div className="text-sm text-gray-600">{ticket.id}</div>
								</div>
								<div>
									<div className="mb-1 text-sm font-medium text-gray-900">Subject</div>
									<div className="text-sm text-gray-600">{ticket.subject}</div>
								</div>
								<div>
									<div className="mb-1 text-sm font-medium text-gray-900">Category</div>
									<Badge variant="outline" className="capitalize">
										{ticket.category.replace("-", " ")}
									</Badge>
								</div>
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
							</CardContent>
						</Card>

						{/* Status Management */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Status Management</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<div className="mb-2 text-sm font-medium text-gray-900">Current Status</div>
									{getStatusBadge(ticketStatus)}
								</div>
								<div>
									<div className="mb-2 text-sm font-medium text-gray-900">Change Status</div>
									<Select value={ticketStatus} onValueChange={handleStatusChange}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="open">Open</SelectItem>
											<SelectItem value="in-progress">In Progress</SelectItem>
											<SelectItem value="waiting">Waiting for Customer</SelectItem>
											<SelectItem value="resolved">Resolved</SelectItem>
											<SelectItem value="closed">Closed</SelectItem>
										</SelectContent>
									</Select>
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
											<Avatar className="h-10 w-10">
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
												className={`absolute -right-1 -bottom-1 h-3 w-3 rounded-full border-2 border-white ${
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
								<Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
									<Download className="mr-2 h-4 w-4" />
									Download Transcript
								</Button>
								<Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
									<FileText className="mr-2 h-4 w-4" />
									View Full History
								</Button>
								<Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
									<User className="mr-2 h-4 w-4" />
									View Customer Profile
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
