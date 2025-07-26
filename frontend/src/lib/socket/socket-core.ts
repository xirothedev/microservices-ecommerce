import { io, Socket } from "socket.io-client";

const sockets: Record<string, Socket> = {};

export function getOrCreateSocket(namespace: string): Socket {
	if (!sockets[namespace]) {
		sockets[namespace] = io(`${process.env.NEXT_PUBLIC_API_URL}/${namespace}`, {
			withCredentials: true,
			transports: ["websocket"],
		});
	}
	return sockets[namespace];
}

export function disconnectSocket(namespace: string) {
	if (sockets[namespace]) {
		sockets[namespace].disconnect();
		delete sockets[namespace];
	}
}

export function onSocketEvent<T = any>(namespace: string, event: string, callback: (data: T) => void) {
	const socket = getOrCreateSocket(namespace);
	socket.on(event, callback);
}

export function offSocketEvent(namespace: string, event: string, callback?: (...args: any[]) => void) {
	const socket = sockets[namespace];
	if (!socket) return;
	if (callback) socket.off(event, callback);
	else socket.off(event);
}

export function emitSocketEvent<T = any>(namespace: string, event: string, data: T) {
	const socket = sockets[namespace];
	if (!socket) return;
	socket.emit(event, data);
}
