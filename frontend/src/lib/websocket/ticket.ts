import { useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TicketMessageResponse } from "@/@types/backend";
import useSocket from "./socket";

const NAMESPACE = "ticket";

/**
 * Socket events for ticket system
 */
export const TicketSocketEvents = {
	NEW_TICKET: "ticket.new",
	JOIN_TICKET_ROOM: "join.ticket.room",
	NEW_MESSAGE: "ticket.message.new",
} as const;

/**
 * Hook for ticket-specific socket operations
 * Provides a pre-configured socket connection for ticket namespace
 */
export function useTicketSocket() {
	return useSocket(NAMESPACE);
}

/**
 * Hook for managing ticket room operations
 * Handles joining ticket rooms and listening for new messages
 */
export function useTicketRoom(ticketId: string) {
	const socket = useTicketSocket();
	const queryClient = useQueryClient();

	// Join ticket room
	const joinTicketRoom = useCallback(() => {
		console.log(`🏠 Joining ticket room: ${ticketId}`);
		socket.emit(TicketSocketEvents.JOIN_TICKET_ROOM, ticketId);
	}, [socket, ticketId]);

	// Handle new message
	const handleNewMessage = useCallback(
		(message: TicketMessageResponse) => {
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
		},
		[ticketId, queryClient],
	);

	// Setup socket listeners
	useEffect(() => {
		// Join room when component mounts
		joinTicketRoom();

		// Listen for new messages
		console.log("👂 Listening for NEW_MESSAGE events");
		socket.on(TicketSocketEvents.NEW_MESSAGE, handleNewMessage);

		// Cleanup
		return () => {
			console.log("🧹 Cleaning up socket listeners");
			socket.off(TicketSocketEvents.NEW_MESSAGE, handleNewMessage);
		};
	}, [socket, joinTicketRoom, handleNewMessage]);

	return {
		handleNewMessage,
	};
}
