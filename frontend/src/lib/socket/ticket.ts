import useSocket from "@/hooks/use-socket";

const NAMESPACE = "ticket";
export const TicketSocketEvents = {
	NEW_TICKET: "ticket.new",
	JOIN_TICKET_ROOM: "join.ticket.room",
	NEW_MESSAGE: "ticket.message.new",
} as const;

export function useTicketSocket() {
	return useSocket(NAMESPACE);
}
