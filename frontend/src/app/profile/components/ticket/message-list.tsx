"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUserQuery } from "@/hooks/use-user";
import axiosInstance from "@/lib/axios";
import { TicketSocketEvents, useTicketSocket } from "@/lib/socket/ticket";
import { getFallbackString } from "@/lib/utils";
import { IAxiosError } from "@/typings";
import { TicketMessageResponse } from "@/typings/backend";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
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

	const messages: TicketMessageResponse[] = (data?.pages || []).flatMap((page) => page.data || []);

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
			<div className="space-y-4">
				{messages.map((message, index) => {
					const isUser = message.sender.user.id === user?.me.id;
					const prevMessage = messages[index + 1];
					const showAvatar = !prevMessage || prevMessage.sender.user.id !== message.sender.user.id;

					const nextMessage = messages[index - 1];
					const showTimestamp =
						!nextMessage ||
						nextMessage.sender.user.id !== message.sender.user.id ||
						new Date(message.createdAt).getTime() - new Date(nextMessage.createdAt).getTime() > 300000;

					return (
						<motion.div
							key={message.id}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
							className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
						>
							{/* Avatar */}
							<div className="flex-shrink-0">
								{showAvatar ? (
									<Avatar className="h-8 w-8">
										<AvatarImage src={message.sender.user.avatarUrl ?? undefined} />
										<AvatarFallback className="text-xs">
											{getFallbackString(message.sender.user.fullname)}
										</AvatarFallback>
									</Avatar>
								) : (
									<div className="h-8 w-8" />
								)}
							</div>

							{/* Message Content */}
							<div className={`max-w-[70%] flex-1 ${isUser ? "items-end" : "items-start"} flex flex-col`}>
								{/* Sender Name (only show for first message in group) */}
								{showAvatar && !isUser && (
									<div className="mb-1 flex items-center gap-2">
										<span className="text-sm font-medium text-gray-900">
											{message.sender.user.fullname}
										</span>
										<Badge variant="secondary" className="bg-blue-100 text-xs text-blue-800">
											Support Agent
										</Badge>
									</div>
								)}

								{/* Message Bubble */}
								<div
									className={`rounded-lg px-4 py-2 ${isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"}`}
								>
									<p className="text-sm whitespace-pre-wrap">{message.content}</p>

									{/* Attachments as Bento Grid */}
									{message.attachments && message.attachments.length > 0 && (
										<div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
											{message.attachments.map((attachmentUrl, i) => {
												const fileName =
													attachmentUrl.split("/").pop() || `attachment-${i + 1}`;

												return (
													<div
														key={i}
														className="group relative aspect-square overflow-hidden rounded-lg bg-gray-200"
													>
														<Image
															src={attachmentUrl}
															alt={fileName}
															fill
															className="object-cover transition-transform duration-200 hover:scale-105"
														/>
													</div>
												);
											})}
										</div>
									)}
								</div>

								{/* Timestamp and Read Status */}
								{showTimestamp && (
									<div
										className={`mt-1 flex items-center gap-2 text-xs text-gray-500 ${
											isUser ? "flex-row-reverse" : "flex-row"
										}`}
									>
										<span>{formatTime(message.createdAt)}</span>
										{isUser && (
											<span className={message.isRead ? "text-blue-600" : "text-gray-400"}>
												{message.isRead ? "✓✓" : "✓"}
											</span>
										)}
									</div>
								)}
							</div>
						</motion.div>
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
