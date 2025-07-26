import axiosInstance from "./axios";

export async function refreshToken() {
	try {
		await axiosInstance.post("/auth/refresh-token");
		return true;
	} catch (err) {
		console.error("Failed to refresh token", err);
		// Redirect to login here or throw error for caller to handle
		// window.location.href = "/login";
		return false;
	}
}
