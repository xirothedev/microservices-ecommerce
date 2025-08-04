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
