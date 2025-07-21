"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axiosInstance from "@/lib/axios";
import { IAxiosError } from "@/typings";
import { TicketCategory, TicketPriority, TicketStatus } from "@/typings/backend";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
	AlertCircle,
	ArrowRight,
	Calendar,
	CheckCircle,
	Clock,
	MessageCircle,
	Search,
	User,
	XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

interface Ticket {
	id: string;
	createAt: Date;
	updateAt: Date;
	numericalOrder: number;
	title: string;
	description: string;
	status: TicketStatus;
	category: TicketCategory;
	priority: TicketPriority;
	referenceContext: string | null;
	attachments: string[];
	author: {
		id: string;
		fullname: string;
		email: string;
		avatarUrl: string | null;
	};
	assigned: {
		id: string;
		fullname: string;
		email: string;
		avatarUrl: string | null;
	} | null;
	_count: {
		messages: number;
	};
}

const PAGE_SIZE = 10;

const statusConfig = {
	OPEN: { icon: AlertCircle, color: "text-red-600", bg: "bg-red-100", label: "Open" },
	IN_PROGRESS: { icon: Clock, color: "text-blue-600", bg: "bg-blue-100", label: "In Progress" },
	WAITING: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100", label: "Waiting" },
	RESOLVED: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100", label: "Resolved" },
	CLOSED: { icon: XCircle, color: "text-gray-600", bg: "bg-gray-100", label: "Closed" },
};

const priorityConfig = {
	LOW: { color: "text-gray-600", bg: "bg-gray-100" },
	MEDIUM: { color: "text-blue-600", bg: "bg-blue-100" },
	HIGH: { color: "text-orange-600", bg: "bg-orange-100" },
	URGENT: { color: "text-red-600", bg: "bg-red-100" },
};

export default function TicketHistory() {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [priorityFilter, setPriorityFilter] = useState<string>("all");

	const { data, isLoading, isError, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery<
		{
			data: Ticket[];
			"@data"?: { totalItems: number; nextCursor?: string; hasNextPage?: boolean };
		},
		IAxiosError
	>({
		queryKey: ["tickets", searchQuery, statusFilter, priorityFilter],
		queryFn: async ({ pageParam }) => {
			const params: Record<string, unknown> = { limit: PAGE_SIZE };
			if (pageParam) params.cursor = pageParam;
			if (searchQuery) params.search = searchQuery;
			if (statusFilter !== "all") params.status = statusFilter;
			if (priorityFilter !== "all") params.priority = priorityFilter;
			const res = await axiosInstance.get("/ticket", { params });
			return res.data;
		},
		getNextPageParam: (lastPage) => lastPage?.["@data"]?.nextCursor || null,
		initialPageParam: undefined,
	});

	const tickets: Ticket[] = (data?.pages || []).flatMap((page) => page.data || []);

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
				{priority.toLowerCase()}
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
									<SelectItem value="OPEN">Open</SelectItem>
									<SelectItem value="IN_PROGRESS">In Progress</SelectItem>
									<SelectItem value="WAITING">Waiting</SelectItem>
									<SelectItem value="RESOLVED">Resolved</SelectItem>
									<SelectItem value="CLOSED">Closed</SelectItem>
								</SelectContent>
							</Select>
							<Select value={priorityFilter} onValueChange={setPriorityFilter}>
								<SelectTrigger className="w-32">
									<SelectValue placeholder="Priority" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Priority</SelectItem>
									<SelectItem value="URGENT">Urgent</SelectItem>
									<SelectItem value="HIGH">High</SelectItem>
									<SelectItem value="MEDIUM">Medium</SelectItem>
									<SelectItem value="LOW">Low</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Tickets List */}
			<div className="space-y-4">
				{isLoading ? (
					<div className="text-center text-gray-500">Loading...</div>
				) : isError ? (
					<div className="text-center text-red-500">
						Failed to load tickets
						<button onClick={() => refetch()} className="ml-2 underline">
							Try Again
						</button>
					</div>
				) : (
					<InfiniteScroll
						dataLength={tickets.length}
						next={fetchNextPage}
						hasMore={!!hasNextPage}
						loader={<div className="py-4 text-center text-gray-500">Loading...</div>}
						endMessage={<div className="py-4 text-center text-gray-500">End</div>}
						scrollThreshold={0.8}
					>
						<AnimatePresence>
							{tickets.length === 0 ? (
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
								tickets.map((ticket, index) => (
									<motion.div
										key={ticket.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -20 }}
										transition={{ duration: 0.3, delay: index * 0.1 }}
									>
										<Card className="mt-2 transition-shadow hover:shadow-md">
											<CardContent className="p-6">
												<div className="flex items-start justify-between">
													<div className="min-w-0 flex-1">
														<div className="mb-2 flex items-center gap-3">
															<h3 className="truncate text-lg font-semibold text-gray-900">
																{ticket.title}
															</h3>
															{true && (
																<Badge variant="destructive" className="text-xs">
																	New
																</Badge>
															)}
														</div>

														<div className="mb-3 flex items-center gap-4 text-sm text-gray-600">
															<span className="font-medium">{ticket.id}</span>
															<div className="flex items-center gap-1">
																<Calendar className="h-4 w-4" />
																{formatDate(ticket.createAt.toString())}
															</div>
															<div className="flex items-center gap-1">
																<MessageCircle className="h-4 w-4" />
																{ticket._count.messages} messages
															</div>
														</div>

														<div className="mb-4 flex items-center gap-3">
															{getStatusBadge(ticket.status)}
															{getPriorityBadge(ticket.priority)}
															<Badge variant="outline" className="capitalize">
																{ticket.category.replace("_", " ").toLowerCase()}
															</Badge>
														</div>

														{/* ticket.assignedAgent */}
														{ticket.assigned && (
															<div className="flex items-center gap-2 text-sm text-gray-600">
																<User className="h-4 w-4" />
																<span>Assigned to:</span>
																<div className="flex items-center gap-2">
																	<Avatar className="h-5 w-5">
																		<AvatarImage
																			src={
																				ticket.assigned.avatarUrl ||
																				"https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg"
																			}
																		/>
																		<AvatarFallback className="text-xs">
																			{ticket.assigned.fullname
																				.split(" ")
																				.map((n) => n[0])
																				.join("")}
																		</AvatarFallback>
																	</Avatar>
																	<span className="font-medium">
																		{ticket.assigned.fullname}
																	</span>
																</div>
															</div>
														)}
													</div>

													<div className="ml-4 flex flex-col items-end gap-2">
														<div className="text-xs text-gray-500">
															Updated {formatDate(ticket.updateAt.toString())}
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
					</InfiniteScroll>
				)}
			</div>

			{/* Summary Stats */}
			{tickets.length > 0 && (
				<Card>
					<CardContent className="p-4">
						<div className="grid grid-cols-2 gap-4 text-center md:grid-cols-5">
							{Object.entries(statusConfig).map(([status, config]) => {
								const count = tickets.filter((t) => t.status === status).length;
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
