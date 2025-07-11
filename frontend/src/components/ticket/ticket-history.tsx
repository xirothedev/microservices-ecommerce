"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Search,
	MessageCircle,
	Clock,
	CheckCircle,
	AlertCircle,
	XCircle,
	Calendar,
	User,
	ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

interface Ticket {
	id: string;
	subject: string;
	category: string;
	priority: "low" | "medium" | "high" | "urgent";
	status: "open" | "in-progress" | "waiting" | "resolved" | "closed";
	createdAt: string;
	updatedAt: string;
	assignedAgent?: {
		name: string;
		avatar: string;
	};
	messageCount: number;
	hasUnreadMessages: boolean;
}

// Mock ticket data
const mockTickets: Ticket[] = [
	{
		id: "TKT-123456",
		subject: "Unable to access Apple ID Premium Setup",
		category: "technical",
		priority: "high",
		status: "in-progress",
		createdAt: "2024-01-15T10:30:00Z",
		updatedAt: "2024-01-15T14:22:00Z",
		assignedAgent: {
			name: "Sarah Johnson",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
		},
		messageCount: 8,
		hasUnreadMessages: true,
	},
	{
		id: "TKT-123455",
		subject: "Billing issue with Facebook Business Account",
		category: "billing",
		priority: "medium",
		status: "waiting",
		createdAt: "2024-01-14T09:15:00Z",
		updatedAt: "2024-01-14T16:45:00Z",
		assignedAgent: {
			name: "Mike Chen",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
		},
		messageCount: 5,
		hasUnreadMessages: false,
	},
	{
		id: "TKT-123454",
		subject: "Request refund for YouTube Premium Family",
		category: "refund",
		priority: "low",
		status: "resolved",
		createdAt: "2024-01-12T14:20:00Z",
		updatedAt: "2024-01-13T11:30:00Z",
		assignedAgent: {
			name: "Emma Davis",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
		},
		messageCount: 12,
		hasUnreadMessages: false,
	},
	{
		id: "TKT-123453",
		subject: "Account verification problems",
		category: "account",
		priority: "medium",
		status: "closed",
		createdAt: "2024-01-10T08:45:00Z",
		updatedAt: "2024-01-11T17:20:00Z",
		assignedAgent: {
			name: "David Wilson",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
		},
		messageCount: 6,
		hasUnreadMessages: false,
	},
	{
		id: "TKT-123452",
		subject: "Instagram Growth Package not working",
		category: "service",
		priority: "urgent",
		status: "open",
		createdAt: "2024-01-16T16:10:00Z",
		updatedAt: "2024-01-16T16:10:00Z",
		messageCount: 1,
		hasUnreadMessages: true,
	},
];

export default function TicketHistory() {
	const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
	const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(mockTickets);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [priorityFilter, setPriorityFilter] = useState("all");

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

	// Filter tickets based on search and filters
	useEffect(() => {
		let filtered = tickets;

		// Search filter
		if (searchQuery) {
			filtered = filtered.filter(
				(ticket) =>
					ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
					ticket.id.toLowerCase().includes(searchQuery.toLowerCase()),
			);
		}

		// Status filter
		if (statusFilter !== "all") {
			filtered = filtered.filter((ticket) => ticket.status === statusFilter);
		}

		// Priority filter
		if (priorityFilter !== "all") {
			filtered = filtered.filter((ticket) => ticket.priority === priorityFilter);
		}

		setFilteredTickets(filtered);
	}, [tickets, searchQuery, statusFilter, priorityFilter]);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
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

	return (
		<div className="space-y-6">
			{/* Filters */}
			<Card>
				<CardContent className="p-4">
					<div className="flex flex-col gap-4 sm:flex-row">
						<div className="relative flex-1">
							<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
							<Input
								placeholder="Search tickets by subject or ID..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10"
							/>
						</div>
						<div className="flex gap-2">
							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger className="w-32">
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Status</SelectItem>
									<SelectItem value="open">Open</SelectItem>
									<SelectItem value="in-progress">In Progress</SelectItem>
									<SelectItem value="waiting">Waiting</SelectItem>
									<SelectItem value="resolved">Resolved</SelectItem>
									<SelectItem value="closed">Closed</SelectItem>
								</SelectContent>
							</Select>
							<Select value={priorityFilter} onValueChange={setPriorityFilter}>
								<SelectTrigger className="w-32">
									<SelectValue placeholder="Priority" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Priority</SelectItem>
									<SelectItem value="urgent">Urgent</SelectItem>
									<SelectItem value="high">High</SelectItem>
									<SelectItem value="medium">Medium</SelectItem>
									<SelectItem value="low">Low</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Tickets List */}
			<div className="space-y-4">
				<AnimatePresence>
					{filteredTickets.length === 0 ? (
						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
							<Card>
								<CardContent className="p-8 text-center">
									<MessageCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
									<h3 className="mb-2 text-lg font-medium text-gray-900">No tickets found</h3>
									<p className="text-gray-600">
										{searchQuery || statusFilter !== "all" || priorityFilter !== "all"
											? "Try adjusting your search or filters"
											: "You haven't submitted any support tickets yet"}
									</p>
								</CardContent>
							</Card>
						</motion.div>
					) : (
						filteredTickets.map((ticket, index) => (
							<motion.div
								key={ticket.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.3, delay: index * 0.1 }}
							>
								<Card className="transition-shadow hover:shadow-md">
									<CardContent className="p-6">
										<div className="flex items-start justify-between">
											<div className="min-w-0 flex-1">
												<div className="mb-2 flex items-center gap-3">
													<h3 className="truncate text-lg font-semibold text-gray-900">
														{ticket.subject}
													</h3>
													{ticket.hasUnreadMessages && (
														<Badge variant="destructive" className="text-xs">
															New
														</Badge>
													)}
												</div>

												<div className="mb-3 flex items-center gap-4 text-sm text-gray-600">
													<span className="font-medium">{ticket.id}</span>
													<div className="flex items-center gap-1">
														<Calendar className="h-4 w-4" />
														{formatDate(ticket.createdAt)}
													</div>
													<div className="flex items-center gap-1">
														<MessageCircle className="h-4 w-4" />
														{ticket.messageCount} messages
													</div>
												</div>

												<div className="mb-4 flex items-center gap-3">
													{getStatusBadge(ticket.status)}
													{getPriorityBadge(ticket.priority)}
													<Badge variant="outline" className="capitalize">
														{ticket.category.replace("-", " ")}
													</Badge>
												</div>

												{ticket.assignedAgent && (
													<div className="flex items-center gap-2 text-sm text-gray-600">
														<User className="h-4 w-4" />
														<span>Assigned to:</span>
														<div className="flex items-center gap-2">
															<Avatar className="h-5 w-5">
																<AvatarImage
																	src={
																		ticket.assignedAgent.avatar ||
																		"https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg"
																	}
																/>
																<AvatarFallback className="text-xs">
																	{ticket.assignedAgent.name
																		.split(" ")
																		.map((n) => n[0])
																		.join("")}
																</AvatarFallback>
															</Avatar>
															<span className="font-medium">
																{ticket.assignedAgent.name}
															</span>
														</div>
													</div>
												)}
											</div>

											<div className="ml-4 flex flex-col items-end gap-2">
												<div className="text-xs text-gray-500">
													Updated {formatDate(ticket.updatedAt)}
												</div>
												<Link href={`/profile/tickets/${ticket.id}`}>
													<Button
														variant="outline"
														size="sm"
														className="flex items-center gap-2 bg-transparent"
													>
														View Details
														<ArrowRight className="h-4 w-4" />
													</Button>
												</Link>
											</div>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						))
					)}
				</AnimatePresence>
			</div>

			{/* Summary Stats */}
			{filteredTickets.length > 0 && (
				<Card>
					<CardContent className="p-4">
						<div className="grid grid-cols-2 gap-4 text-center md:grid-cols-5">
							{Object.entries(statusConfig).map(([status, config]) => {
								const count = filteredTickets.filter((t) => t.status === status).length;
								return (
									<div key={status} className="space-y-1">
										<div className={`text-2xl font-bold ${config.color}`}>{count}</div>
										<div className="text-xs text-gray-600">{config.label}</div>
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
