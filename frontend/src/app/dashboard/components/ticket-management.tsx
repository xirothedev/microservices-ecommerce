"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDebounce } from "@/hooks/use-debounce";
import { AlertCircle, CheckCircle, Clock, Eye, MoreHorizontal, Search, UserCheck, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import AdminChatInterface from "./admin-chat-interface";
import TicketAssignment from "./ticket-assignment";

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
	lastResponse?: string;
}

const mockTickets: Ticket[] = [
	{
		id: "TKT-123456",
		subject: "Unable to access Apple ID Premium Setup",
		description:
			"I purchased the Apple ID Premium Setup service yesterday but I'm unable to access the setup instructions...",
		category: "technical",
		priority: "high",
		status: "in-progress",
		createdAt: "2024-01-15T10:30:00Z",
		updatedAt: "2024-01-15T14:22:00Z",
		user: {
			id: "user-1",
			name: "John Doe",
			email: "john.doe@example.com",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
		},
		assignedAgent: {
			id: "agent-1",
			name: "Sarah Johnson",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
			email: "sarah.johnson@digitalpro.com",
			status: "online",
		},
		attachments: 2,
		lastResponse: "2024-01-15T14:22:00Z",
	},
	{
		id: "TKT-123457",
		subject: "Billing inquiry for Social Media Management",
		description: "I was charged twice for the same service. Can you please help me resolve this?",
		category: "billing",
		priority: "medium",
		status: "open",
		createdAt: "2024-01-15T09:15:00Z",
		updatedAt: "2024-01-15T09:15:00Z",
		user: {
			id: "user-2",
			name: "Alice Johnson",
			email: "alice.johnson@example.com",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
		},
		attachments: 1,
	},
	{
		id: "TKT-123458",
		subject: "Request for refund",
		description: "I'm not satisfied with the SEO service and would like to request a refund.",
		category: "billing",
		priority: "low",
		status: "waiting",
		createdAt: "2024-01-14T16:45:00Z",
		updatedAt: "2024-01-15T11:30:00Z",
		user: {
			id: "user-3",
			name: "Bob Smith",
			email: "bob.smith@example.com",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
		},
		assignedAgent: {
			id: "agent-2",
			name: "Mike Wilson",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
			email: "mike.wilson@digitalpro.com",
			status: "away",
		},
		attachments: 0,
		lastResponse: "2024-01-15T11:30:00Z",
	},
	{
		id: "TKT-123459",
		subject: "Feature request for dashboard",
		description: "It would be great to have a dark mode option in the user dashboard.",
		category: "feature-request",
		priority: "low",
		status: "resolved",
		createdAt: "2024-01-13T14:20:00Z",
		updatedAt: "2024-01-14T10:15:00Z",
		user: {
			id: "user-4",
			name: "Carol Davis",
			email: "carol.davis@example.com",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
		},
		assignedAgent: {
			id: "agent-1",
			name: "Sarah Johnson",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
			email: "sarah.johnson@digitalpro.com",
			status: "online",
		},
		attachments: 0,
		lastResponse: "2024-01-14T10:15:00Z",
	},
	{
		id: "TKT-123460",
		subject: "Account security concern",
		description: "I noticed some unusual activity on my account. Can you please check?",
		category: "security",
		priority: "urgent",
		status: "closed",
		createdAt: "2024-01-12T08:30:00Z",
		updatedAt: "2024-01-13T16:45:00Z",
		user: {
			id: "user-5",
			name: "David Wilson",
			email: "david.wilson@example.com",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
		},
		assignedAgent: {
			id: "agent-3",
			name: "Emma Thompson",
			avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
			email: "emma.thompson@digitalpro.com",
			status: "offline",
		},
		attachments: 3,
		lastResponse: "2024-01-13T16:45:00Z",
	},
];

const mockAgents = [
	{
		id: "agent-1",
		name: "Sarah Johnson",
		email: "sarah.johnson@digitalpro.com",
		avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
		status: "online" as const,
		activeTickets: 3,
	},
	{
		id: "agent-2",
		name: "Mike Wilson",
		email: "mike.wilson@digitalpro.com",
		avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
		status: "away" as const,
		activeTickets: 2,
	},
	{
		id: "agent-3",
		name: "Emma Thompson",
		email: "emma.thompson@digitalpro.com",
		avatar: "https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg?height=32&width=32",
		status: "offline" as const,
		activeTickets: 1,
	},
];

export default function TicketManagement() {
	const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
	const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(mockTickets);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [priorityFilter, setPriorityFilter] = useState<string>("all");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
	const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
	const [isChatModalOpen, setIsChatModalOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const debouncedSearchTerm = useDebounce(searchTerm, 300);

	useEffect(() => {
		let filtered = tickets;

		// Apply search filter
		if (debouncedSearchTerm) {
			filtered = filtered.filter(
				(ticket) =>
					ticket.subject.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
					ticket.user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
					ticket.id.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
			);
		}

		// Apply status filter
		if (statusFilter !== "all") {
			filtered = filtered.filter((ticket) => ticket.status === statusFilter);
		}

		// Apply priority filter
		if (priorityFilter !== "all") {
			filtered = filtered.filter((ticket) => ticket.priority === priorityFilter);
		}

		// Apply category filter
		if (categoryFilter !== "all") {
			filtered = filtered.filter((ticket) => ticket.category === categoryFilter);
		}

		setFilteredTickets(filtered);
	}, [tickets, debouncedSearchTerm, statusFilter, priorityFilter, categoryFilter]);

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

	const getStatusBadge = (status: string) => {
		const statusConfig = {
			open: { icon: AlertCircle, color: "text-red-600", bg: "bg-red-100", label: "Open" },
			"in-progress": { icon: Clock, color: "text-blue-600", bg: "bg-blue-100", label: "In Progress" },
			waiting: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100", label: "Waiting" },
			resolved: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100", label: "Resolved" },
			closed: { icon: XCircle, color: "text-gray-600", bg: "bg-gray-100", label: "Closed" },
		};

		const config = statusConfig[status as keyof typeof statusConfig];
		const IconComponent = config.icon;

		return (
			<Badge variant="secondary" className={`${config.bg} ${config.color} border-0`}>
				<IconComponent className="mr-1 h-3 w-3" />
				{config.label}
			</Badge>
		);
	};

	const getPriorityBadge = (priority: string) => {
		const priorityConfig = {
			low: { color: "text-gray-600", bg: "bg-gray-100" },
			medium: { color: "text-blue-600", bg: "bg-blue-100" },
			high: { color: "text-orange-600", bg: "bg-orange-100" },
			urgent: { color: "text-red-600", bg: "bg-red-100" },
		};

		const config = priorityConfig[priority as keyof typeof priorityConfig];
		return (
			<Badge variant="outline" className={`${config.bg} ${config.color} border-0 capitalize`}>
				{priority}
			</Badge>
		);
	};

	const getCategoryBadge = (category: string) => {
		const categoryConfig = {
			technical: { color: "text-purple-600", bg: "bg-purple-100" },
			billing: { color: "text-green-600", bg: "bg-green-100" },
			"feature-request": { color: "text-blue-600", bg: "bg-blue-100" },
			security: { color: "text-red-600", bg: "bg-red-100" },
			general: { color: "text-gray-600", bg: "bg-gray-100" },
		};

		const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.general;
		return (
			<Badge variant="outline" className={`${config.bg} ${config.color} border-0 capitalize`}>
				{category.replace("-", " ")}
			</Badge>
		);
	};

	const handleViewTicket = (ticket: Ticket) => {
		setSelectedTicket(ticket);
		setIsChatModalOpen(true);
	};

	const handleAssignTicket = (ticket: Ticket) => {
		setSelectedTicket(ticket);
		setIsAssignmentModalOpen(true);
	};

	const handleTicketAssignment = async (ticketId: string, agentId: string) => {
		setLoading(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const agent = mockAgents.find((a) => a.id === agentId);
		if (agent) {
			setTickets((prev) =>
				prev.map((ticket) =>
					ticket.id === ticketId
						? {
								...ticket,
								assignedAgent: {
									id: agent.id,
									name: agent.name,
									avatar: agent.avatar,
									email: agent.email,
									status: agent.status,
								},
								status: "in-progress" as const,
								updatedAt: new Date().toISOString(),
							}
						: ticket,
				),
			);
		}

		setIsAssignmentModalOpen(false);
		setSelectedTicket(null);
		setLoading(false);
	};

	const handleStatusChange = async (ticketId: string, newStatus: TicketStatus) => {
		setLoading(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		setTickets((prev) =>
			prev.map((ticket) =>
				ticket.id === ticketId
					? {
							...ticket,
							status: newStatus,
							updatedAt: new Date().toISOString(),
						}
					: ticket,
			),
		);
		setLoading(false);
	};

	const getTicketStats = () => {
		const stats = {
			total: tickets.length,
			open: tickets.filter((t) => t.status === "open").length,
			inProgress: tickets.filter((t) => t.status === "in-progress").length,
			waiting: tickets.filter((t) => t.status === "waiting").length,
			resolved: tickets.filter((t) => t.status === "resolved").length,
			closed: tickets.filter((t) => t.status === "closed").length,
			unassigned: tickets.filter((t) => !t.assignedAgent).length,
		};
		return stats;
	};

	const stats = getTicketStats();

	return (
		<div className="space-y-6">
			{/* Stats Overview */}
			<div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
				<Card>
					<CardContent className="pt-4">
						<div className="text-center">
							<div className="text-2xl font-bold">{stats.total}</div>
							<div className="text-xs text-gray-600">Total</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-4">
						<div className="text-center">
							<div className="text-2xl font-bold text-red-600">{stats.open}</div>
							<div className="text-xs text-gray-600">Open</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-4">
						<div className="text-center">
							<div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
							<div className="text-xs text-gray-600">In Progress</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-4">
						<div className="text-center">
							<div className="text-2xl font-bold text-yellow-600">{stats.waiting}</div>
							<div className="text-xs text-gray-600">Waiting</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-4">
						<div className="text-center">
							<div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
							<div className="text-xs text-gray-600">Resolved</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-4">
						<div className="text-center">
							<div className="text-2xl font-bold text-gray-600">{stats.closed}</div>
							<div className="text-xs text-gray-600">Closed</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-4">
						<div className="text-center">
							<div className="text-2xl font-bold text-orange-600">{stats.unassigned}</div>
							<div className="text-xs text-gray-600">Unassigned</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle>Support Tickets</CardTitle>
					<CardDescription>Manage and respond to customer support requests</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-4 lg:flex-row">
						<div className="relative flex-1">
							<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
							<Input
								placeholder="Tìm kiếm theo ID, tiêu đề, người dùng..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="w-full lg:w-[150px]">
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
							<SelectTrigger className="w-full lg:w-[150px]">
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
						<Select value={categoryFilter} onValueChange={setCategoryFilter}>
							<SelectTrigger className="w-full lg:w-[150px]">
								<SelectValue placeholder="Category" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Categories</SelectItem>
								<SelectItem value="technical">Technical</SelectItem>
								<SelectItem value="billing">Billing</SelectItem>
								<SelectItem value="feature-request">Feature Request</SelectItem>
								<SelectItem value="security">Security</SelectItem>
								<SelectItem value="general">General</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Tickets Table */}
			<Card>
				<CardHeader>
					<CardTitle>Tickets ({filteredTickets.length})</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Ticket</TableHead>
									<TableHead>User</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Priority</TableHead>
									<TableHead>Category</TableHead>
									<TableHead>Assigned Agent</TableHead>
									<TableHead>Created</TableHead>
									<TableHead>Updated</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredTickets.map((ticket, index) => (
									<motion.tr
										key={ticket.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.3, delay: index * 0.1 }}
										className="hover:bg-gray-50"
									>
										<TableCell>
											<div>
												<div className="font-medium">{ticket.id}</div>
												<div className="max-w-xs truncate text-sm text-gray-600">
													{ticket.subject}
												</div>
												{ticket.attachments > 0 && (
													<div className="mt-1 text-xs text-gray-500">
														📎 {ticket.attachments} attachment
														{ticket.attachments > 1 ? "s" : ""}
													</div>
												)}
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
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
													<div className="text-sm font-medium">{ticket.user.name}</div>
													<div className="text-xs text-gray-600">{ticket.user.email}</div>
												</div>
											</div>
										</TableCell>
										<TableCell>{getStatusBadge(ticket.status)}</TableCell>
										<TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
										<TableCell>{getCategoryBadge(ticket.category)}</TableCell>
										<TableCell>
											{ticket.assignedAgent ? (
												<div className="flex items-center gap-2">
													<div className="relative">
														<Avatar className="h-6 w-6">
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
														<div
															className={`absolute -right-1 -bottom-1 h-3 w-3 rounded-full border border-white ${
																ticket.assignedAgent.status === "online"
																	? "bg-green-500"
																	: ticket.assignedAgent.status === "away"
																		? "bg-yellow-500"
																		: "bg-gray-400"
															}`}
														/>
													</div>
													<div className="text-sm">{ticket.assignedAgent.name}</div>
												</div>
											) : (
												<Badge variant="outline" className="border-orange-200 text-orange-600">
													Unassigned
												</Badge>
											)}
										</TableCell>
										<TableCell className="text-sm text-gray-600">
											{formatDate(ticket.createdAt)}
										</TableCell>
										<TableCell className="text-sm text-gray-600">
											{formatDate(ticket.updatedAt)}
										</TableCell>
										<TableCell className="text-right">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" className="h-8 w-8 p-0">
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuLabel>Actions</DropdownMenuLabel>
													<DropdownMenuItem onClick={() => handleViewTicket(ticket)}>
														<Eye className="mr-2 h-4 w-4" />
														View & Chat
													</DropdownMenuItem>
													<DropdownMenuItem onClick={() => handleAssignTicket(ticket)}>
														<UserCheck className="mr-2 h-4 w-4" />
														Assign Agent
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														onClick={() => handleStatusChange(ticket.id, "in-progress")}
														disabled={ticket.status === "in-progress"}
													>
														<Clock className="mr-2 h-4 w-4" />
														Mark In Progress
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => handleStatusChange(ticket.id, "resolved")}
														disabled={
															ticket.status === "resolved" || ticket.status === "closed"
														}
													>
														<CheckCircle className="mr-2 h-4 w-4" />
														Mark Resolved
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => handleStatusChange(ticket.id, "closed")}
														disabled={ticket.status === "closed"}
														className="text-gray-600"
													>
														<XCircle className="mr-2 h-4 w-4" />
														Close Ticket
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</motion.tr>
								))}
							</TableBody>
						</Table>
					</div>

					{filteredTickets.length === 0 && (
						<div className="py-12 text-center">
							<div className="mb-4 text-gray-400">
								<Search className="mx-auto h-12 w-12" />
							</div>
							<h3 className="mb-2 text-lg font-medium text-gray-900">No tickets found</h3>
							<p className="text-gray-600">Try adjusting your search criteria or filters.</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Ticket Assignment Modal */}
			<TicketAssignment
				ticket={selectedTicket}
				agents={mockAgents}
				isOpen={isAssignmentModalOpen}
				onClose={() => {
					setIsAssignmentModalOpen(false);
					setSelectedTicket(null);
				}}
				onAssign={handleTicketAssignment}
				loading={loading}
			/>

			{/* Admin Chat Interface Modal */}
			<AdminChatInterface
				ticket={selectedTicket}
				isOpen={isChatModalOpen}
				onClose={() => {
					setIsChatModalOpen(false);
					setSelectedTicket(null);
				}}
			/>
		</div>
	);
}
