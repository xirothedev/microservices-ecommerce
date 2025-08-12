"use client";

import { IAxiosError } from "@/@types";
import { TicketResponse } from "@/@types/api/ticket";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import axiosInstance from "@/lib/axios";
import { formatDate } from "@/lib/format";
import { getFallbackString } from "@/lib/utils";
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

	const debouncedSearchQuery = useDebounce(searchQuery, 500);

	const { data, isLoading, isError, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery<
		{
			data: TicketResponse[];
			"@data"?: { totalItems: number; nextCursor?: string; hasNextPage?: boolean };
		},
		IAxiosError
	>({
		queryKey: ["tickets", debouncedSearchQuery, statusFilter, priorityFilter],
		queryFn: async ({ pageParam }) => {
			const params: Record<string, unknown> = { limit: PAGE_SIZE };
			if (pageParam) params.cursor = pageParam;
			if (debouncedSearchQuery) params.search = debouncedSearchQuery;
			if (statusFilter !== "all") params.status = statusFilter;
			if (priorityFilter !== "all") params.priority = priorityFilter;
			const res = await axiosInstance.get("/ticket", { params });
			return res.data;
		},
		getNextPageParam: (lastPage) => lastPage?.["@data"]?.nextCursor || null,
		initialPageParam: undefined,
	});

	const tickets: TicketResponse[] = (data?.pages || []).flatMap((page) => page.data || []);

	const getStatusIcon = (status: string) => {
		const config = statusConfig[status as keyof typeof statusConfig];
		if (!config) return null;
		const IconComponent = config.icon;
		return <IconComponent className={`h-4 w-4 ${config.color}`} />;
	};

	const getStatusBadge = (status: string) => {
		const config = statusConfig[status as keyof typeof statusConfig];
		if (!config) return null;
		return (
			<Badge variant="secondary" className={`${config.bg} ${config.color} border-0`}>
				{getStatusIcon(status)}
				<span className="ml-1 hidden sm:inline">{config.label}</span>
			</Badge>
		);
	};

	const getPriorityBadge = (priority: string) => {
		const config = priorityConfig[priority as keyof typeof priorityConfig];
		if (!config) return null;
		return (
			<Badge variant="outline" className={`${config.bg} ${config.color} border-0 capitalize`}>
				{priority.toLowerCase()}
			</Badge>
		);
	};

	const isNewTicket = (ticket: TicketResponse) => {
		const now = new Date();
		const ticketDate = new Date(ticket.createdAt);
		const diffInHours = (now.getTime() - ticketDate.getTime()) / (1000 * 60 * 60);
		return diffInHours < 24; // Consider tickets created in last 24 hours as "new"
	};

	return (
		<div className="space-y-4 sm:space-y-6">
			{/* Filters */}
			<Card>
				<CardContent className="p-3 sm:p-4">
					<div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
						<div className="relative flex-1">
							<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
							<Input
								placeholder="Tìm kiếm theo tiêu đề, ID..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10"
							/>
						</div>
						<div className="flex gap-2">
							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger className="w-28 cursor-pointer sm:w-32">
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									{[
										{ value: "all", label: "All Status" },
										{ value: "OPEN", label: "Open" },
										{ value: "IN_PROGRESS", label: "In Progress" },
										{ value: "WAITING", label: "Waiting" },
										{ value: "RESOLVED", label: "Resolved" },
										{ value: "CLOSED", label: "Closed" },
									].map(({ value, label }) => (
										<SelectItem className="cursor-pointer" value={value} key={value}>
											{label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Select value={priorityFilter} onValueChange={setPriorityFilter}>
								<SelectTrigger className="w-28 cursor-pointer sm:w-32">
									<SelectValue placeholder="Priority" />
								</SelectTrigger>
								<SelectContent>
									{[
										{ value: "all", label: "All Priority" },
										{ value: "URGENT", label: "Urgent" },
										{ value: "HIGH", label: "High" },
										{ value: "MEDIUM", label: "Medium" },
										{ value: "LOW", label: "Low" },
									].map(({ value, label }) => (
										<SelectItem className="cursor-pointer" value={value} key={value}>
											{label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Tickets List */}
			<div className="space-y-3 sm:space-y-4">
				{isLoading ? (
					<div className="text-center text-gray-500">Loading tickets...</div>
				) : isError ? (
					<div className="text-center text-red-500">
						Failed to load tickets
						<button onClick={() => refetch()} className="ml-2 underline hover:no-underline">
							Try Again
						</button>
					</div>
				) : (
					<InfiniteScroll
						dataLength={tickets.length}
						next={fetchNextPage}
						hasMore={!!hasNextPage}
						loader={<TicketLoading />}
						endMessage={<TicketEnded />}
						scrollThreshold={0.8}
					>
						<AnimatePresence>
							{tickets.length === 0 ? (
								<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
									<Card>
										<CardContent className="p-6 text-center sm:p-8">
											<MessageCircle className="mx-auto mb-4 h-10 w-10 text-gray-400 sm:h-12 sm:w-12" />
											<h3 className="mb-2 text-base font-medium text-gray-900 sm:text-lg">
												No tickets found
											</h3>
											<p className="text-sm text-gray-600 sm:text-base">
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
										transition={{ duration: 0.3, delay: index * 0.05 }}
									>
										<Card className="mb-4 transition-shadow hover:shadow-md">
											<CardContent className="p-4 sm:p-6">
												<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
													<div className="min-w-0 flex-1">
														<div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
															<h3 className="line-clamp-2 text-base font-semibold text-gray-900 sm:line-clamp-1 sm:text-lg">
																{ticket.title}
															</h3>
															{isNewTicket(ticket) && (
																<Badge variant="destructive" className="w-fit text-xs">
																	New
																</Badge>
															)}
														</div>

														<div className="mb-3 flex flex-col gap-2 text-sm text-gray-600 sm:flex-col sm:gap-1">
															<span className="font-medium">#{ticket.id}</span>
															<div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
																<div className="flex items-center gap-1">
																	<Calendar className="h-4 w-4" />
																	{formatDate(ticket.createdAt, {
																		hour: "2-digit",
																		minute: "2-digit",
																	})}
																</div>
																<div className="flex items-center gap-1">
																	<MessageCircle className="h-4 w-4" />
																	{ticket._count?.messages || 0} messages
																</div>
															</div>
														</div>

														<div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-3">
															{getStatusBadge(ticket.status)}
															{getPriorityBadge(ticket.priority)}
															<Badge variant="outline" className="capitalize">
																{ticket.category.replace("_", " ").toLowerCase()}
															</Badge>
														</div>

														{/* Assigned Agent */}
														{ticket.assign && (
															<div className="flex items-center gap-2 text-sm text-gray-600">
																<User className="h-4 w-4" />
																<span className="hidden sm:inline">Assigned to:</span>
																<span className="sm:hidden">Agent:</span>
																<div className="flex items-center gap-2">
																	<Avatar className="h-5 w-5">
																		<AvatarImage
																			src={ticket.assign.avatarUrl || undefined}
																			alt={ticket.assign.fullname}
																		/>
																		<AvatarFallback className="text-xs">
																			{getFallbackString(ticket.assign.fullname)}
																		</AvatarFallback>
																	</Avatar>
																	<span className="max-w-32 truncate font-medium sm:max-w-none">
																		{ticket.assign.fullname}
																	</span>
																</div>
															</div>
														)}
													</div>

													<div className="flex flex-col items-start gap-2 sm:ml-4 sm:items-end">
														<div className="text-xs text-gray-500">
															Updated{" "}
															{formatDate(ticket.updatedAt, {
																hour: "2-digit",
																minute: "2-digit",
															})}
														</div>
														<Link
															href={`/profile/tickets/${ticket.id}`}
															className="w-full sm:w-auto"
														>
															<Button
																variant="outline"
																size="sm"
																className="flex w-full items-center justify-center gap-2 bg-transparent sm:w-auto"
															>
																<span className="hidden sm:inline">View Details</span>
																<span className="sm:hidden">View</span>
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
					<CardContent className="p-3 sm:p-4">
						<div className="grid grid-cols-3 gap-2 text-center sm:grid-cols-5 sm:gap-4">
							{Object.entries(statusConfig).map(([status, config]) => {
								const count = tickets.filter((t) => t.status === status).length;
								return (
									<div key={status} className="space-y-1">
										<div className={`text-lg font-bold sm:text-2xl ${config.color}`}>{count}</div>
										<div className="hidden text-xs text-gray-600 sm:block">{config.label}</div>
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

function TicketLoading() {
	return (
		<div className="flex items-center justify-center py-4">
			<div className="flex items-center gap-2">
				<div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
				<span className="text-sm text-gray-500">Loading more tickets...</span>
			</div>
		</div>
	);
}

function TicketEnded() {
	return (
		<div className="py-4 text-center text-gray-500">
			<p className="text-sm">No more tickets to load</p>
		</div>
	);
}
