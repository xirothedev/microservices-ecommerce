"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUserQuery } from "@/lib/api/user";
import axiosInstance from "@/lib/axios";
import { IAxiosError } from "@/@types";
import { TicketResponse } from "@/@types/backend";
import { useQuery } from "@tanstack/react-query";
import {
	AlertCircle,
	ArrowLeft,
	Calendar,
	CheckCircle,
	Clock,
	Download,
	FileText,
	MessageCircle,
	Tag,
	XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect } from "react";
import ChatInterface from "./chat-interface";
import { formatDate } from "@/lib/format";
import { useGetOnlineUser } from "@/lib/ws/users";

interface TicketDetailProps {
	ticketId: string;
}

interface TicketDetail {
	id: string;
	numericalOrder: number;
	createdAt: string;
	updatedAt: string;
	title: string;
	description: string;
	status: string;
	category: string;
	priority: string;
	referenceContext: string;
	attachments: string[];
	author: {
		id: string;
		fullname: string;
		email: string;
		avatarUrl: string;
	};
	assign: {
		id: string;
		fullname: string;
		email: string;
		avatarUrl: string;
	} | null;
	messages: Array<{
		id: string;
		content: string;
		isRead: boolean;
		createdAt: string;
		updatedAt: string;
		attachments: string[];
		sender: {
			id: string;
			fullname: string;
			email: string;
			avatarUrl: string;
		};
	}>;
}

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

const contextIcons = {
	order: "🛒",
	product: "📦",
	transaction: "💳",
	account: "👤",
};

export default function TicketDetail({ ticketId }: TicketDetailProps) {
	const router = useRouter();
	const { data: currentUser } = useUserQuery();
	const { data, error, isError, isLoading } = useQuery<TicketResponse, IAxiosError>({
		queryKey: [ticketId],
		queryFn: async () => {
			const res = await axiosInstance.get<{ data: TicketResponse }>(`/ticket/${ticketId}`);

			return res.data.data;
		},
	});

	// Determine user role and who to display in sidebar
	const isCurrentUserAssign = currentUser?.me.id === data?.assign?.id;
	// const isCurrentUserAuthor = currentUser?.me.id === data?.author?.id;
	const displayUser = isCurrentUserAssign ? data?.author : data?.assign;

	const { status: displayUserStatus } = useGetOnlineUser(displayUser?.id ?? "Unknown User");

	useEffect(() => {
		if (isError && error.response?.status === 404) {
			router.push("/profile/tickets");
		}
	}, [error, router, isError]);

	const getStatusIcon = (status: string) => {
		const config = statusConfig[status as keyof typeof statusConfig];
		const IconComponent = config?.icon ?? Fragment;
		return <IconComponent className={`h-4 w-4 ${config?.color}`} />;
	};

	const getStatusBadge = (status: string) => {
		const config = statusConfig[status as keyof typeof statusConfig];
		return (
			<Badge variant="secondary" className={`${config?.bg} ${config?.color} border-0`}>
				{getStatusIcon(status)}
				<span className="ml-1">{config?.label}</span>
			</Badge>
		);
	};

	const getPriorityBadge = (priority: string) => {
		const config = priorityConfig[priority as keyof typeof priorityConfig];
		return (
			<Badge variant="outline" className={`${config?.bg} ${config?.color} border-0 capitalize`}>
				{priority}
			</Badge>
		);
	};

	if (isLoading || !data) {
		return <SkeletonLoading />;
	}

	if (isError && error.response?.status === 404) {
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
						<h1 className="line-clamp-1 text-2xl font-bold text-gray-900">{data?.title}</h1>
						<p className="text-gray-600">Ticket #{data?.id}</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					{data?.status && getStatusBadge(data.status)}
					{data?.priority && getPriorityBadge(data.priority)}
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
									{data?.description?.split("\n").map((paragraph, index) => (
										<p key={index} className="mb-2">
											{paragraph}
										</p>
									))}
								</div>
							</div>

							{data?.contexts && data.contexts.length > 0 && (
								<div>
									<h4 className="mb-2 font-medium text-gray-900">Referenced Items</h4>
									<div className="flex flex-wrap gap-2">
										{data.contexts.map((context, index) => (
											<Badge key={index} variant="outline" className="flex items-center gap-1">
												<span>{contextIcons[context.type as keyof typeof contextIcons]}</span>
												{context.label}
											</Badge>
										))}
									</div>
								</div>
							)}

							{data?.attachments && data.attachments.length > 0 && (
								<div>
									<h4 className="mb-2 font-medium text-gray-900">Attachments</h4>
									<div
										className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
										style={{ gridAutoRows: "120px" }}
									>
										{data.attachments
											.filter((url: string) => /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(url))
											.map((url: string, index: number) => (
												<div
													key={index}
													className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
												>
													<Image
														src={url}
														alt={`Attachment ${index + 1}`}
														fill
														className="object-cover transition-transform duration-300 group-hover:scale-105"
														sizes="(max-width: 768px) 100vw, 33vw"
													/>
													{/* Optional: Overlay for download or preview */}
													<Link
														href={url}
														target="_blank"
														rel="noopener noreferrer"
														className="absolute right-2 bottom-2 rounded bg-white/80 px-2 py-1 text-xs text-gray-700 opacity-0 transition-opacity group-hover:opacity-100"
													>
														Preview
													</Link>
												</div>
											))}
									</div>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Chat Interface */}
					<Card className="pb-0">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<MessageCircle className="h-5 w-5" />
								Conversation
							</CardTitle>
							<CardDescription>Chat with our support team for real-time assistance</CardDescription>
						</CardHeader>
						<CardContent className="p-0">
							<ChatInterface
								displayUser={displayUser}
								displayUserStatus={displayUserStatus}
								ticketId={ticketId}
							/>
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
								<span className="font-medium">{data && formatDate(data.createdAt)}</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<Clock className="h-4 w-4 text-gray-500" />
								<span className="text-gray-600">Updated:</span>
								<span className="font-medium">{data && formatDate(data.updatedAt)}</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<Tag className="h-4 w-4 text-gray-500" />
								<span className="text-gray-600">Category:</span>
								<Badge variant="outline" className="capitalize">
									{data?.category.replace("_", " ").toLowerCase()}
								</Badge>
							</div>
						</CardContent>
					</Card>

					{/* User Info - Show appropriate person based on current user role */}
					{displayUser && (
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">
									{isCurrentUserAssign ? "Ticket Author" : "Assigned Agent"}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex items-center gap-3">
									<div className="relative">
										<Avatar className="h-12 w-12">
											<AvatarImage
												src={
													displayUser.avatarUrl ||
													"https://preview-nextjs-digital-marketing-site-kzmk65g4en0d6uad4ktq.vusercontent.net/placeholder.svg"
												}
											/>
											<AvatarFallback>
												{displayUser.fullname
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
										<div
											className={`absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-white ${
												// displayUser.status === "online"
												true
													? "bg-green-500"
													: // : displayUser.status === "away"
														false
														? "bg-yellow-500"
														: "bg-gray-400"
											}`}
										/>
									</div>
									<div>
										<p className="font-medium text-gray-900">{displayUser.fullname}</p>
										<p
											className="block max-w-[180px] truncate text-sm text-gray-600"
											title={displayUser.email}
										>
											{displayUser.email}
										</p>
										<div className="flex items-center gap-2">
											<p className="text-xs text-gray-500 capitalize">
												{/* {displayUser.status} */} Online
											</p>
											{!isCurrentUserAssign && (
												<Badge
													variant="secondary"
													className="bg-blue-100 text-xs text-blue-800"
												>
													Support Agent
												</Badge>
											)}
										</div>
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

function SkeletonLoading() {
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
