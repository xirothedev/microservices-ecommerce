import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

const NAMESPACE = "users";

let socket: Socket | null = null;

export const getUsersSocket = (): Socket => {
	if (!socket) {
		socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/${NAMESPACE}`, {
			transports: ["websocket", "polling"],
		});
	}
	return socket;
};

export const UsersSocketEvents = {
	SET_USER_ONLINE: "set.user.online",
	SET_USER_OFFLINE: "set.user.offline",
	GET_USER_STATUS: "get.user.status",
	GET_ONLINE_USERS: "get.online.users",
	GET_ONLINE_USERS_COUNT: "get.online.users.count",
	CHECK_USER_ONLINE: "check.user.online",
	USER_STATUS_CHANGED: "user.status.changed",
} as const;

export function useAutoUpdateUserStatus() {
	const socket = getUsersSocket();

	useEffect(() => {
		socket.emit(UsersSocketEvents.SET_USER_ONLINE);

		return () => {
			socket.emit(UsersSocketEvents.SET_USER_OFFLINE);
		};
	}, []);

	return {
		setUserOnline: () => socket.emit(UsersSocketEvents.SET_USER_ONLINE),
		setUserOffline: () => socket.emit(UsersSocketEvents.SET_USER_OFFLINE),
	};
}

export function useGetOnlineUser(userId: string) {
	const socket = getUsersSocket();
	const [status, setStatus] = useState<"online" | "offline">("offline");

	useEffect(() => {
		socket.on(UsersSocketEvents.USER_STATUS_CHANGED, (data) => {
			if (data.userId === userId) {
				setStatus(data.status);
			}
		});

		return () => {
			socket.off(UsersSocketEvents.USER_STATUS_CHANGED);
		};
	}, [userId]);

	useEffect(() => {
		socket.emit(
			UsersSocketEvents.CHECK_USER_ONLINE,
			{ userId },
			(response: { userId: string; isOnline: boolean }) => {
				if (response && typeof response.isOnline === "boolean") {
					setStatus(response.isOnline ? "online" : "offline");
				}
			},
		);
	}, [userId]);

	return {
		status,
	};
}
