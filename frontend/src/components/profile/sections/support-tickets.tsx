"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Plus, MessageCircle, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

interface SupportTicket {
	id: string;
	subject: string;
	description: string;
	status: "open" | "in-progress" | "resolved" | "closed";
	priority: "low" | "medium" | "high" | "urgent";
	category: string;
	createdDate: string;
	lastUpdated: string;
	responses: number;
}

export default function SupportTickets() {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [newTicket, setNewTicket] = useState({
		subject: "",
		category: "",
		priority: "medium",
		description: "",
	});

	// Mock ticket data
	const tickets: SupportTicket[] = [
		{
			id: "TKT-001",
			subject: "Issue with Apple ID setup",
			description: "Having trouble with the 2FA configuration during Apple ID setup process.",
			status: "in-progress",
			priority: "high",
			category: "Technical Support",
			createdDate: "2024-01-15",
			lastUpdated: "2024-01-16",
			responses: 3,
		},
		{
			id: "TKT-002",
			subject: "Billing question about recent charge",
			description: "Need clarification on the charge for Facebook Business Account setup.",
			status: "resolved",
			priority: "medium",
			category: "Billing",
			createdDate: "2024-01-10",
			lastUpdated: "2024-01-12",
			responses: 2,
		},
		{
			id: "TKT-003",
			subject: "Request for service modification",
			description: "Would like to upgrade my YouTube Premium package to include additional features.",
			status: "open",
			priority: "low",
			category: "Service Request",
			createdDate: "2024-01-08",
			lastUpdated: "2024-01-08",
			responses: 0,
		},
		{
			id: "TKT-004",
			subject: "Account access issues",
			description: "Unable to access my account dashboard after password reset.",
			status: "closed",
			priority: "urgent",
			category: "Account",
			createdDate: "2024-01-05",
			lastUpdated: "2024-01-06",
			responses: 5,
		},
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "open":
				return "bg-blue-100 text-blue-800";
			case "in-progress":
				return "bg-yellow-100 text-yellow-800";
			case "resolved":
				return "bg-green-100 text-green-800";
			case "closed":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "low":
				return "bg-gray-100 text-gray-800";
			case "medium":
				return "bg-blue-100 text-blue-800";
			case "high":
				return "bg-orange-100 text-orange-800";
			case "urgent":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "open":
				return <AlertCircle className="h-4 w-4" />;
			case "in-progress":
				return <Clock className="h-4 w-4" />;
			case "resolved":
				return <CheckCircle className="h-4 w-4" />;
			case "closed":
				return <CheckCircle className="h-4 w-4" />;
			default:
				return <MessageCircle className="h-4 w-4" />;
		}
	};

	const filteredTickets = tickets.filter((ticket) => {
		const matchesSearch =
			ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
			ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	const handleCreateTicket = () => {
		// Here you would typically make an API call to create the ticket
		console.log("Creating ticket:", newTicket);
		setIsCreateDialogOpen(false);
		setNewTicket({
			subject: "",
			category: "",
			priority: "medium",
			description: "",
		});
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle>Support Tickets</CardTitle>
						<CardDescription>Manage your support requests and get help from our team</CardDescription>
					</div>
					<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
						<DialogTrigger asChild>
							<Button className="flex items-center gap-2">
								<Plus className="h-4 w-4" />
								New Ticket
							</Button>
						</DialogTrigger>
						<DialogContent className="max-w-md">
							<DialogHeader>
								<DialogTitle>Create Support Ticket</DialogTitle>
								<DialogDescription>
									Describe your issue and we'll get back to you as soon as possible.
								</DialogDescription>
							</DialogHeader>
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="subject">Subject</Label>
									<Input
										id="subject"
										value={newTicket.subject}
										onChange={(e) => setNewTicket((prev) => ({ ...prev, subject: e.target.value }))}
										placeholder="Brief description of your issue"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="category">Category</Label>
									<Select
										value={newTicket.category}
										onValueChange={(value) =>
											setNewTicket((prev) => ({ ...prev, category: value }))
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select category" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="technical">Technical Support</SelectItem>
											<SelectItem value="billing">Billing</SelectItem>
											<SelectItem value="service">Service Request</SelectItem>
											<SelectItem value="account">Account</SelectItem>
											<SelectItem value="general">General Inquiry</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="priority">Priority</Label>
									<Select
										value={newTicket.priority}
										onValueChange={(value) =>
											setNewTicket((prev) => ({ ...prev, priority: value }))
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="low">Low</SelectItem>
											<SelectItem value="medium">Medium</SelectItem>
											<SelectItem value="high">High</SelectItem>
											<SelectItem value="urgent">Urgent</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="description">Description</Label>
									<Textarea
										id="description"
										value={newTicket.description}
										onChange={(e) =>
											setNewTicket((prev) => ({ ...prev, description: e.target.value }))
										}
										placeholder="Provide detailed information about your issue"
										rows={4}
									/>
								</div>
								<div className="flex justify-end space-x-2">
									<Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
										Cancel
									</Button>
									<Button onClick={handleCreateTicket}>Create Ticket</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</CardHeader>
				<CardContent>
					{/* Filters */}
					<div className="mb-6 flex flex-col gap-4 md:flex-row">
						<div className="flex-1">
							<div className="relative">
								<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
								<Input
									placeholder="Search tickets..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10"
								/>
							</div>
						</div>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="w-full md:w-40">
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="open">Open</SelectItem>
								<SelectItem value="in-progress">In Progress</SelectItem>
								<SelectItem value="resolved">Resolved</SelectItem>
								<SelectItem value="closed">Closed</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Ticket List */}
					<div className="space-y-4">
						{filteredTickets.map((ticket, index) => (
							<motion.div
								key={ticket.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: index * 0.1 }}
								className="rounded-lg border p-4 transition-colors hover:bg-gray-50"
							>
								<div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
									<div className="flex-1">
										<div className="mb-2 flex items-center gap-3">
											{getStatusIcon(ticket.status)}
											<h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
											<Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
											<Badge className={getPriorityColor(ticket.priority)}>
												{ticket.priority}
											</Badge>
										</div>
										<p className="mb-3 line-clamp-2 text-sm text-gray-600">{ticket.description}</p>
										<div className="flex flex-col gap-2 text-sm text-gray-500 sm:flex-row sm:items-center">
											<span>Ticket #{ticket.id}</span>
											<span className="hidden sm:inline">•</span>
											<span>{ticket.category}</span>
											<span className="hidden sm:inline">•</span>
											<span>Created: {new Date(ticket.createdDate).toLocaleDateString()}</span>
											<span className="hidden sm:inline">•</span>
											<span>Updated: {new Date(ticket.lastUpdated).toLocaleDateString()}</span>
											{ticket.responses > 0 && (
												<>
													<span className="hidden sm:inline">•</span>
													<span className="flex items-center gap-1">
														<MessageCircle className="h-3 w-3" />
														{ticket.responses} responses
													</span>
												</>
											)}
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Button variant="outline" size="sm">
											View Details
										</Button>
										{ticket.status === "open" || ticket.status === "in-progress" ? (
											<Button variant="outline" size="sm">
												Add Response
											</Button>
										) : null}
									</div>
								</div>
							</motion.div>
						))}
					</div>

					{filteredTickets.length === 0 && (
						<div className="py-8 text-center">
							<MessageCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
							<p className="text-gray-500">No support tickets found matching your criteria.</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Support Summary */}
			<Card>
				<CardHeader>
					<CardTitle>Support Summary</CardTitle>
					<CardDescription>Overview of your support activity</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-4">
						<div className="rounded-lg bg-blue-50 p-4 text-center">
							<div className="text-2xl font-bold text-blue-600">{tickets.length}</div>
							<div className="text-sm text-gray-600">Total Tickets</div>
						</div>
						<div className="rounded-lg bg-yellow-50 p-4 text-center">
							<div className="text-2xl font-bold text-yellow-600">
								{tickets.filter((t) => t.status === "open" || t.status === "in-progress").length}
							</div>
							<div className="text-sm text-gray-600">Active</div>
						</div>
						<div className="rounded-lg bg-green-50 p-4 text-center">
							<div className="text-2xl font-bold text-green-600">
								{tickets.filter((t) => t.status === "resolved").length}
							</div>
							<div className="text-sm text-gray-600">Resolved</div>
						</div>
						<div className="rounded-lg bg-gray-50 p-4 text-center">
							<div className="text-2xl font-bold text-gray-600">
								{Math.round(tickets.reduce((sum, t) => sum + t.responses, 0) / tickets.length) || 0}
							</div>
							<div className="text-sm text-gray-600">Avg Responses</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
