"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Minus, UserCheck, Wifi, WifiOff } from "lucide-react";
import { useState } from "react";

interface Agent {
	id: string;
	name: string;
	email: string;
	avatar: string;
	status: "online" | "offline" | "away";
	activeTickets: number;
}

interface Ticket {
	id: string;
	subject: string;
	priority: "low" | "medium" | "high" | "urgent";
	category: string;
	user: {
		name: string;
		email: string;
	};
	assignedAgent?: {
		id: string;
		name: string;
	};
}

interface TicketAssignmentProps {
	ticket: Ticket | null;
	agents: Agent[];
	isOpen: boolean;
	onClose: () => void;
	onAssign: (ticketId: string, agentId: string) => void;
	loading: boolean;
}

export default function TicketAssignment({
	ticket,
	agents,
	isOpen,
	onClose,
	onAssign,
	loading,
}: TicketAssignmentProps) {
	const [selectedAgentId, setSelectedAgentId] = useState<string>("");

	if (!ticket) return null;

	const handleAssign = () => {
		if (selectedAgentId) {
			onAssign(ticket.id, selectedAgentId);
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "online":
				return <Wifi className="h-4 w-4 text-green-600" />;
			case "away":
				return <Minus className="h-4 w-4 text-yellow-600" />;
			case "offline":
				return <WifiOff className="h-4 w-4 text-gray-600" />;
			default:
				return <WifiOff className="h-4 w-4 text-gray-600" />;
		}
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "online":
				return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Online</Badge>;
			case "away":
				return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Away</Badge>;
			case "offline":
				return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Offline</Badge>;
			default:
				return <Badge variant="secondary">{status}</Badge>;
		}
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

	// Sort agents by availability (online first, then by workload)
	const sortedAgents = [...agents].sort((a, b) => {
		if (a.status === "online" && b.status !== "online") return -1;
		if (b.status === "online" && a.status !== "online") return 1;
		return a.activeTickets - b.activeTickets;
	});

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Assign Ticket to Agent</DialogTitle>
					<DialogDescription>Select an agent to handle this support ticket</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					{/* Ticket Info */}
					<Card>
						<CardContent className="pt-4">
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<h3 className="font-medium">Ticket #{ticket.id}</h3>
									<div className="flex items-center gap-2">
										{getPriorityBadge(ticket.priority)}
										<Badge variant="outline" className="capitalize">
											{ticket.category.replace("-", " ")}
										</Badge>
									</div>
								</div>
								<p className="text-sm text-gray-600">{ticket.subject}</p>
								<div className="text-sm text-gray-500">
									Customer: {ticket.user.name} ({ticket.user.email})
								</div>
								{ticket.assignedAgent && (
									<div className="text-sm text-orange-600">
										Currently assigned to: {ticket.assignedAgent.name}
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Agent Selection */}
					<div>
						<h4 className="mb-4 font-medium">Select Agent</h4>
						<RadioGroup value={selectedAgentId} onValueChange={setSelectedAgentId}>
							<div className="space-y-3">
								{sortedAgents.map((agent) => (
									<div key={agent.id}>
										<Label
											htmlFor={agent.id}
											className="flex cursor-pointer items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-gray-50"
										>
											<RadioGroupItem value={agent.id} id={agent.id} />
											<Avatar className="h-10 w-10">
												<AvatarImage
													src={
														agent.avatar ||
														"https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg"
													}
												/>
												<AvatarFallback>
													{agent.name
														.split(" ")
														.map((n) => n[0])
														.join("")}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1">
												<div className="flex items-center justify-between">
													<div>
														<div className="font-medium">{agent.name}</div>
														<div className="text-sm text-gray-600">{agent.email}</div>
													</div>
													<div className="flex items-center gap-3">
														<div className="text-sm text-gray-600">
															{agent.activeTickets} active ticket
															{agent.activeTickets !== 1 ? "s" : ""}
														</div>
														{getStatusBadge(agent.status)}
													</div>
												</div>
											</div>
										</Label>
									</div>
								))}
							</div>
						</RadioGroup>
					</div>

					{/* Actions */}
					<div className="flex justify-end gap-3">
						<Button variant="outline" onClick={onClose} disabled={loading}>
							Cancel
						</Button>
						<Button onClick={handleAssign} disabled={!selectedAgentId || loading}>
							<UserCheck className="mr-2 h-4 w-4" />
							{loading ? "Assigning..." : "Assign Ticket"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
