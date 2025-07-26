"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUserQuery } from "@/hooks/use-user";
import axiosInstance from "@/lib/axios";
import { getFallbackString } from "@/lib/utils";
import { IAxiosError } from "@/typings";
import { TicketMessageResponse } from "@/typings/backend";
import { useInfiniteQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";

interface MessageListProps {
	ticketId: string;
}

export default function MessageList({ ticketId }: MessageListProps) {
	const { data: user } = useUserQuery();

	const { data, fetchNextPage, hasNextPage } = useInfiniteQuery<
		{
			data: TicketMessageResponse[];
			"@data"?: { totalItems: number; nextCursor?: string; hasNextPage?: boolean };
		},
		IAxiosError
	>({
		queryKey: ["tickets"],
		queryFn: async () => {
			const res = await axiosInstance.get(`/ticket/${ticketId}/messages`);
			return res.data;
		},
		getNextPageParam: (lastPage) => lastPage?.["@data"]?.nextCursor || null,
		initialPageParam: undefined,
	});

	const messages: TicketMessageResponse[] = (data?.pages || []).flatMap((page) => page.data || []);

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
			next={fetchNextPage}
			hasMore={!!hasNextPage}
			loader={<div className="py-4 text-center text-gray-500">Loading...</div>}
			endMessage={<div className="py-4 text-center text-gray-500">End</div>}
			scrollThreshold={0.8}
			inverse
		>
			<div className="space-y-4">
				{messages.map((message, index) => {
					const isUser = message.sender.user.id === user?.me.id;
					const showAvatar = index === 0 || messages[index - 1].sender.user.id !== message.sender.user.id;
					const showTimestamp =
						index === messages.length - 1 ||
						messages[index + 1].sender.user.id !== message.sender.user.id ||
						new Date(messages[index + 1].createdAt).getTime() - new Date(message.createdAt).getTime() >
							300000; // 5 minutes

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
