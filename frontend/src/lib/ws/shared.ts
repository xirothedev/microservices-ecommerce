import { Socket } from "socket.io-client";
import { refreshToken } from "../refresh-token";

let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 3;

export function handleWebSocketError(socket: Socket | null, err: any) {
	console.log("WebSocket error:", err);

	switch (err.code) {
		case "INVALID_TOKEN_OR_EXPIRED":
		case "ACCESS_TOKEN_NOT_FOUND":
			if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
				reconnectAttempts++;
				refreshToken().then((success) => {
					if (success) {
						socket?.connect();
					} else {
						console.error("Refresh token failed, redirecting to login");
						window.location.href = "/login";
					}
				});
			} else {
				console.error("Max reconnect attempts reached");
				window.location.href = "/login";
			}
			break;

		case "USER_HAS_BEEN_BANNED":
			console.error("Your account has been banned");
			alert("Your account has been banned");
			window.location.href = "/login";
			break;

		case "USER_NOT_VERIFIED":
			console.error("Please verify your email first");
			alert("Please verify your email first");
			window.location.href = "/";
			break;

		case "USER_HAS_BEEN_LOCKED":
			console.error("Your account has been locked");
			alert("Your account has been locked");
			window.location.href = "/";
			break;

		default:
			console.error("Unknown WebSocket error:", err);
	}
}

export function resetReconnectAttempts() {
	reconnectAttempts = 0;
}
