import { useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TicketMessageResponse, TicketResponse } from "@/@types/backend";
import { io, Socket } from "socket.io-client";

const NAMESPACE = "ticket";

let socket: Socket | null = null;

export const getTicketSocket = (): Socket => {
	if (!socket) {
		socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/${NAMESPACE}`, {
			transports: ["websocket", "polling"],
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

	useEffect(() => {
		ticketSocket.emit(TicketSocketEvents.JOIN_TICKET_ROOM, ticketId);

		return () => {
			ticketSocket.emit(TicketSocketEvents.LEAVE_TICKET_ROOM, ticketId);
		};
	}, []);

	useEffect(() => {
		ticketSocket.on(TicketSocketEvents.NEW_MESSAGE, handleNewMessage);

		return () => {
			ticketSocket.off(TicketSocketEvents.NEW_MESSAGE, handleNewMessage);
		};
	}, [handleNewMessage]);

	return {
		handleNewMessage,
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
		ticketSocket.emit(TicketSocketEvents.JOIN_USER_ROOM);

		return () => {
			ticketSocket.emit(TicketSocketEvents.LEAVE_USER_ROOM);
		};
	}, []);

	useEffect(() => {
		ticketSocket.on(TicketSocketEvents.NEW_TICKET, handleNewTicket);

		return () => {
			ticketSocket.off(TicketSocketEvents.NEW_TICKET, handleNewTicket);
		};
	}, [handleNewTicket]);

	return {
		handleNewTicket,
	};
}
