import { TicketMessageResponse, TicketResponse } from "@/@types/backend";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { handleWebSocketError } from "./shared";

const NAMESPACE = "ticket";

let socket: Socket | null = null;
let initialized = false;

export const getTicketSocket = (): Socket => {
	if (!socket) {
		socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/${NAMESPACE}`, {
			transports: ["websocket", "polling"],
		});
	}

	if (!initialized) {
		socket.on("connect", () => {
			initialized = true;
		});

		socket.on("connect_error", (err: any) => {
			handleWebSocketError(socket, err);
		});
	}

	return socket;
};

export const TicketSocketEvents = {
	JOIN_USER_ROOM: "join.user.room",
	LEAVE_USER_ROOM: "leave.user.room",
	NEW_TICKET: "ticket.new",
	JOIN_TICKET_ROOM: "join.ticket.room",
	LEAVE_TICKET_ROOM: "leave.ticket.room",
	NEW_MESSAGE: "ticket.message.new",
	USER_TYPING: "ticket.user.typing",
} as const;

export function useTicketMessageSocket(ticketId: string) {
	const ticketSocket = getTicketSocket();
	const queryClient = useQueryClient();

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

					const exists = oldData.pages.some((page) => page.data.some((m) => m.id === message.id));

					if (exists) {
						console.log("❌ Message already exists, skipping duplicate");
						return oldData;
					}

					const updatedData = {
						...oldData,
						pages:
							oldData.pages && oldData.pages.length > 0
								? oldData.pages.map((page: { data: TicketMessageResponse[] }, index: number) => {
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

	useEffect(() => {
		if (!ticketSocket.connected) return;

		ticketSocket.emit(TicketSocketEvents.JOIN_TICKET_ROOM, ticketId);

		return () => {
			ticketSocket.emit(TicketSocketEvents.LEAVE_TICKET_ROOM, ticketId);
		};
	}, [ticketId, ticketSocket.connected]);

	useEffect(() => {
		if (!ticketSocket.connected) return;

		ticketSocket.on(TicketSocketEvents.NEW_MESSAGE, handleNewMessage);

		return () => {
			ticketSocket.off(TicketSocketEvents.NEW_MESSAGE, handleNewMessage);
		};
	}, [handleNewMessage, ticketSocket.connected]);

	return {
		handleNewMessage,
	};
}

export function useTicketTyping(enemyId?: string, ticketId?: string) {
	const ticketSocket = getTicketSocket();
	const [isEnemyTyping, setIsEnemyTyping] = useState(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Emit typing (debounced)
	const handleSetUserTyping = useMemo(() => {
		return (ticketIdToEmit: string) => {
			ticketSocket.emit(TicketSocketEvents.USER_TYPING, ticketIdToEmit);
		};
	}, [ticketSocket]);

	// Handle received typing event
	const handleUserTyping = useCallback(() => {
		if (!enemyId) return;

		setIsEnemyTyping(true);

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			setIsEnemyTyping(false);
		}, 3000);
	}, [enemyId]);

	// Join room after socket connects
	useEffect(() => {
		if (!ticketId) return;

		const joinRoom = () => {
			ticketSocket.emit(TicketSocketEvents.JOIN_TICKET_ROOM, ticketId);
		};

		// If already connected, join immediately
		if (ticketSocket.connected) {
			joinRoom();
		}

		ticketSocket.on("connect", joinRoom);

		return () => {
			ticketSocket.emit(TicketSocketEvents.LEAVE_TICKET_ROOM, ticketId);
			ticketSocket.off("connect", joinRoom);
		};
	}, [ticketSocket.connected, ticketId]);

	// Listen for typing event
	useEffect(() => {
		if (!ticketSocket.connected) return;

		ticketSocket.on(TicketSocketEvents.USER_TYPING, handleUserTyping);

		return () => {
			ticketSocket.off(TicketSocketEvents.USER_TYPING, handleUserTyping);
		};
	}, [ticketSocket.connected, handleUserTyping]);

	// Clear timeout on unmount
	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

	return {
		isEnemyTyping,
		handleSetUserTyping,
	};
}

export function useTicketSocket() {
	const ticketSocket = getTicketSocket();
	const queryClient = useQueryClient();

	const handleNewTicket = useCallback(
		(ticket: TicketResponse) => {
			queryClient.setQueryData<{ pages: { data: TicketResponse[] }[] }>(["tickets"], (oldData) => {
				if (!oldData) return oldData;
				const exists = oldData.pages.some((page) => page.data.some((t) => t.id === ticket.id));
				if (exists) return oldData;
				return {
					...oldData,
					pages:
						oldData.pages && oldData.pages.length > 0
							? [
									{
										...oldData.pages[0],
										data: [ticket, ...(oldData.pages[0].data || [])],
									},
									...oldData.pages.slice(1),
								]
							: [
									{
										data: [ticket],
										"@data": {},
									},
								],
				};
			});
		},
		[queryClient],
	);

	useEffect(() => {
		if (!ticketSocket.connected) return;

		ticketSocket.emit(TicketSocketEvents.JOIN_USER_ROOM);

		return () => {
			ticketSocket.emit(TicketSocketEvents.LEAVE_USER_ROOM);
		};
	}, [ticketSocket.connected]);

	useEffect(() => {
		if (!ticketSocket.connected) return;

		ticketSocket.on(TicketSocketEvents.NEW_TICKET, handleNewTicket);

		return () => {
			ticketSocket.off(TicketSocketEvents.NEW_TICKET, handleNewTicket);
		};
	}, [ticketSocket.connected]);

	return {
		handleNewTicket,
	};
}
