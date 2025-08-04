"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUserQuery } from "@/lib/api/user";
import axiosInstance from "@/lib/axios";
import { TicketSocketEvents, useTicketSocket } from "@/lib/websocket/ticket";
import { getFallbackString } from "@/lib/utils";
import { IAxiosError } from "@/@types";
import { TicketMessageResponse } from "@/@types/backend";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const PAGE_SIZE = 12;

interface MessageListProps {
	ticketId: string;
}

export default function MessageList({ ticketId }: MessageListProps) {
	const { data: user } = useUserQuery();
	const scrollableRef = useRef<HTMLDivElement>(null);
	const scrollStateRef = useRef<{ scrollHeight: number; scrollTop: number } | null>(null);
	const queryClient = useQueryClient();
	const ticketSocket = useTicketSocket();

	const { data, fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage } = useInfiniteQuery<
		{
			data: TicketMessageResponse[];
			"@data"?: { totalItems: number; prevCursor?: string; hasPrevPage?: boolean };
		},
		IAxiosError
	>({
		queryKey: ["tickets", ticketId, "messages"],
		queryFn: async ({ pageParam }) => {
			const params: Record<string, unknown> = { limit: PAGE_SIZE };
			if (pageParam) params.cursor = pageParam;
			const res = await axiosInstance.get(`/ticket/${ticketId}/messages`, { params });
			return res.data;
		},
		getPreviousPageParam: (firstPage) =>
			firstPage?.["@data"]?.hasPrevPage ? firstPage?.["@data"]?.prevCursor : undefined,
		getNextPageParam: () => undefined,
		initialPageParam: undefined,
	});

	const messages: TicketMessageResponse[] = (data?.pages || [])
		.flatMap((page) => page.data || [])
		.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

	const handleFetchPreviousPage = () => {
		if (scrollableRef.current) {
			// Before fetching, save the current scroll state
			scrollStateRef.current = {
				scrollHeight: scrollableRef.current.scrollHeight,
				scrollTop: scrollableRef.current.scrollTop,
			};
		}
		fetchPreviousPage();
	};

	useLayoutEffect(() => {
		// After data is prepended and DOM is updated, restore scroll position
		if (scrollStateRef.current && scrollableRef.current && isFetchingPreviousPage === false) {
			const { scrollHeight: prevScrollHeight, scrollTop: prevScrollTop } = scrollStateRef.current;
			const newScrollHeight = scrollableRef.current.scrollHeight;
			scrollableRef.current.scrollTop = prevScrollTop + (newScrollHeight - prevScrollHeight);
			scrollStateRef.current = null;
		}
	}, [messages, isFetchingPreviousPage]);

	useEffect(() => {
		console.log("🔌 Setting up ticket socket...");

		console.log("🎫 Joining ticket room:", ticketId);
		ticketSocket.emit(TicketSocketEvents.JOIN_TICKET_ROOM, ticketId);

		function handleNewMessage(message: TicketMessageResponse) {
			console.log("📨 Received new message:", message);
			console.log("🎯 Current ticketId:", ticketId);
			console.log("🎯 Message ticketId:", message.ticket.id);
			console.log("🔍 Message matches current ticket:", message.ticket.id === ticketId);

			if (message.ticket.id !== ticketId) {
				console.log("❌ Message ticket ID doesn't match, ignoring");
				return;
			}

			queryClient.setQueryData<{ pages: { data: TicketMessageResponse[] }[] }>(
				["tickets", ticketId, "messages"],
				(oldData) => {
					if (!oldData) {
						console.log("❌ No existing query data found");
						return oldData;
					}

					// Check if message already exists (avoid duplicate)
					const exists = oldData.pages.some((page) => page.data.some((m) => m.id === message.id));

					if (exists) {
						console.log("❌ Message already exists, skipping duplicate");
						return oldData;
					}

					const updatedData = {
						...oldData,
						pages:
							oldData.pages && oldData.pages.length > 0
								? oldData.pages.map((page: any, index: number) => {
										if (index === 0) {
											return {
												...page,
												data: [...(page.data || []), message],
											};
										}
										return page;
									})
								: [
										{
											data: [message],
											"@data": {},
										},
									],
					};

					return updatedData;
				},
			);
		}

		console.log("👂 Listening for NEW_MESSAGE events");
		ticketSocket.on(TicketSocketEvents.NEW_MESSAGE, handleNewMessage);

		return () => {
			console.log("🧹 Cleaning up socket listeners");
			ticketSocket.off(TicketSocketEvents.NEW_MESSAGE, handleNewMessage);
		};
	}, [ticketId, queryClient, ticketSocket]);

	const formatTime = (timestamp: string) => {
		const date = new Date(timestamp);
		const now = new Date();
		const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

		if (diffInHours < 24) {
			return date.toLocaleTimeString("en-US", {
				hour: "2-digit",
				minute: "2-digit",
				hour12: true,
			});
		} else {
			return date.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
				hour12: true,
			});
		}
	};

	return (
		<InfiniteScroll
			dataLength={messages.length}
			next={handleFetchPreviousPage}
			hasMore={!!hasPreviousPage}
			loader={<MessageLoading />}
			endMessage={<MessageEnded />}
			scrollThreshold={0.8}
			inverse={true}
			scrollableTarget="scrollableDiv"
			style={{ display: "flex", flexDirection: "column-reverse" }}
		>
			<div className="space-y-0">
				{messages.map((message, index) => {
					const isUser = message.sender.user.id === user?.me.id;

					// Since messages are sorted chronologically, we can use simple index logic
					const prevMessage = messages[index - 1]; // Previous (older) message
					const nextMessage = messages[index + 1]; // Next (newer) message

					// Show avatar if this is the first message from this sender or sender changed
					const showAvatar = !prevMessage || prevMessage.sender.user.id !== message.sender.user.id;

					// Add spacing between message groups (when sender changes)
					const isNewGroup = !prevMessage || prevMessage.sender.user.id !== message.sender.user.id;

					return (
						<div
							key={message.id}
							className={`group relative flex gap-4 px-4 transition-colors duration-150 hover:bg-gray-50/50 ${
								isNewGroup ? "mt-4 py-2" : "py-px"
							}`}
						>
							{/* Avatar - Always on the left */}
							<div className="w-10 flex-shrink-0">
								{showAvatar ? (
									<Avatar className="h-10 w-10">
										<AvatarImage src={message.sender.user.avatarUrl ?? undefined} />
										<AvatarFallback className="text-sm">
											{getFallbackString(message.sender.user.fullname)}
										</AvatarFallback>
									</Avatar>
								) : (
									<div className="h-10 w-10" />
								)}
							</div>

							{/* Message Content */}
							<div className="min-w-0 flex-1">
								{/* Header with sender name and timestamp */}
								{showAvatar && (
									<div className="mb-1 flex items-baseline gap-2">
										<span className="cursor-pointer text-sm font-semibold text-gray-900 hover:underline">
											{message.sender.user.fullname}
										</span>
										{!isUser && (
											<Badge
												variant="secondary"
												className="bg-blue-100 px-1.5 py-0.5 text-xs text-blue-800"
											>
												Support Agent
											</Badge>
										)}
										<span className="ml-auto text-xs text-gray-500">
											{formatTime(message.createdAt)}
										</span>
									</div>
								)}

								{/* Message Content - No bubble, flat design */}
								<div className="text-sm leading-relaxed text-gray-900">
									<p className="break-words whitespace-pre-wrap">{message.content}</p>

									{/* Attachments Grid */}
									{message.attachments && message.attachments.length > 0 && (
										<div className="mt-2 grid max-w-md grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
											{message.attachments.map((attachmentUrl, i) => {
												const fileName =
													attachmentUrl.split("/").pop() || `attachment-${i + 1}`;

												return (
													<div
														key={i}
														className="group relative aspect-square cursor-pointer overflow-hidden rounded-md bg-gray-200 transition-opacity hover:opacity-90"
													>
														<Image
															src={attachmentUrl}
															alt={fileName}
															fill
															className="object-cover"
														/>
													</div>
												);
											})}
										</div>
									)}
								</div>

								{/* Compact timestamp for grouped messages */}
								{!showAvatar && (
									<div className="absolute top-1 right-4 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
										<span className="rounded bg-white px-1 text-xs text-gray-400">
											{formatTime(message.createdAt)}
										</span>
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</InfiniteScroll>
	);
}

function MessageLoading() {
	return (
		<div className="flex items-center justify-center py-4">
			<div className="flex items-center gap-2">
				<div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
				<span className="text-sm text-gray-500">Loading more messages...</span>
			</div>
		</div>
	);
}

function MessageEnded() {
	return (
		<div className="py-4 text-center text-gray-500">
			<p className="text-sm">No more messages to load</p>
		</div>
	);
}
