import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";

const sockets: Record<string, Socket> = {};

export default function useSocket(namespace: string) {
	const socketRef = useRef<Socket | null>(null);
	const listenersRef = useRef<Map<string, Set<Function>>>(new Map());
	const isInitializedRef = useRef(false);

	// Get or create socket - memoized to prevent recreation
	const getOrCreateSocket = useCallback((): Socket => {
		if (!sockets[namespace]) {
			console.log(`🔌 [${namespace}] Creating new socket connection`);
			sockets[namespace] = io(`${process.env.NEXT_PUBLIC_API_URL}/${namespace}`, {
				withCredentials: true,
				transports: ["websocket"],
			});
		} else {
			console.log(`🔌 [${namespace}] Reusing existing socket connection`);
		}
		return sockets[namespace];
	}, [namespace]);

	// Connect to socket - memoized to prevent recreation
	const connect = useCallback(() => {
		if (!socketRef.current) {
			socketRef.current = getOrCreateSocket();
		}
		return socketRef.current;
	}, [getOrCreateSocket]);

	// Disconnect socket
	const disconnect = useCallback(() => {
		if (socketRef.current) {
			socketRef.current.disconnect();
			socketRef.current = null;
		}
		if (sockets[namespace]) {
			sockets[namespace].disconnect();
			delete sockets[namespace];
		}
	}, [namespace]);

	// Listen to events - memoized to prevent recreation
	const on = useCallback(
		<T = any>(event: string, callback: (data: T) => void) => {
			const socket = connect();
			console.log(`🎧 [${namespace}] Listening for event: ${event}`);

			// Store listener for cleanup
			if (!listenersRef.current.has(event)) {
				listenersRef.current.set(event, new Set());
			}
			listenersRef.current.get(event)!.add(callback);

			socket.on(event, (data) => {
				console.log(`📡 [${namespace}] Received event: ${event}`, data);
				callback(data);
			});
		},
		[connect, namespace],
	);

	// Remove event listener - memoized to prevent recreation
	const off = useCallback(
		(event: string, callback?: Function) => {
			const socket = socketRef.current;
			if (!socket) return;

			console.log(`🔇 [${namespace}] Removing listener for event: ${event}`);

			if (callback) {
				socket.off(event, callback as any);
				listenersRef.current.get(event)?.delete(callback);
			} else {
				socket.off(event);
				listenersRef.current.delete(event);
			}
		},
		[namespace],
	);

	// Emit events - memoized to prevent recreation
	const emit = useCallback(
		<T = any>(event: string, data: T) => {
			const socket = socketRef.current;
			if (!socket) return;

			console.log(`📤 [${namespace}] Emitting event: ${event}`, data);
			socket.emit(event, data);
		},
		[namespace],
	);

	// Get socket instance - memoized to prevent recreation
	const getSocket = useCallback(() => {
		return socketRef.current;
	}, []);

	// Check if connected - memoized to prevent recreation
	const isConnected = useCallback(() => {
		return socketRef.current?.connected || false;
	}, []);

	// Initialize socket on mount - only once
	useEffect(() => {
		if (isInitializedRef.current) {
			console.log(`🔌 [${namespace}] Socket already initialized, skipping`);
			return;
		}

		console.log(`🔌 [${namespace}] Initializing socket connection`);
		const socket = connect();
		isInitializedRef.current = true;

		// Add connection debugging
		socket.on("connect", () => {
			console.log(`✅ [${namespace}] Socket connected successfully`);
		});

		socket.on("disconnect", () => {
			console.log(`❌ [${namespace}] Socket disconnected`);
		});

		socket.on("connect_error", (error) => {
			console.error(`❌ [${namespace}] Socket connection error:`, error);
		});
	}, [connect, namespace]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			// Remove all listeners
			listenersRef.current.forEach((callbacks, event) => {
				callbacks.forEach((callback) => {
					off(event, callback);
				});
			});
			listenersRef.current.clear();
		};
	}, [off]);

	return {
		connect,
		disconnect,
		on,
		off,
		emit,
		getSocket,
		isConnected,
	};
}
