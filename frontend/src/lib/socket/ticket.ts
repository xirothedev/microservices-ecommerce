import { getOrCreateSocket, disconnectSocket, onSocketEvent, offSocketEvent, emitSocketEvent } from "./socket-core";

const NAMESPACE = "ticket";

export function connectTicketSocket() {
	return getOrCreateSocket(NAMESPACE);
}

export function disconnectTicketSocket() {
	disconnectSocket(NAMESPACE);
}

export function onTicketEvent<T = any>(event: string, callback: (data: T) => void) {
	onSocketEvent<T>(NAMESPACE, event, callback);
}

export function offTicketEvent(event: string, callback?: (...args: any[]) => void) {
	offSocketEvent(NAMESPACE, event, callback);
}

export function emitTicketEvent<T = any>(event: string, data: T) {
	emitSocketEvent<T>(NAMESPACE, event, data);
}
