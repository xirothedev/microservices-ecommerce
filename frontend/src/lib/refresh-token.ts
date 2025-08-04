import axiosInstance from "./axios";

// Maximum number of retry attempts
const MAX_RETRY_ATTEMPTS = 2;
// Base delay between retries in milliseconds (will be increased exponentially)
const BASE_RETRY_DELAY = 300;

// Global variable to track if we're in a protected context
let isInProtectedContext = false;

/**
 * Set the protected context state
 * This should be called by ProtectedProvider
 */
export function setProtectedContext(isProtected: boolean) {
	isInProtectedContext = isProtected;
}

/**
 * Attempts to refresh the authentication token with exponential backoff retry
 * @returns Promise<boolean> - true if token refresh was successful, false otherwise
 */
export async function refreshToken(): Promise<boolean> {
	let retryCount = 0;

	while (retryCount <= MAX_RETRY_ATTEMPTS) {
		try {
			await axiosInstance.post("/auth/refresh-token");
			console.log("Token refreshed successfully");
			return true;
		} catch (err) {
			retryCount++;

			// If we've exhausted all retries, handle the failure
			if (retryCount > MAX_RETRY_ATTEMPTS) {
				console.error("Failed to refresh token after multiple attempts", err);

				// Only redirect to login if we're in a protected context and in browser environment
				if (typeof window !== "undefined" && isInProtectedContext) {
					// Redirect to login page only for protected routes
					window.location.href = "/login";
				}

				return false;
			}

			// Calculate exponential backoff delay with jitter
			const delay = BASE_RETRY_DELAY * Math.pow(2, retryCount - 1) * (0.5 + Math.random() * 0.5);
			console.warn(`Retrying token refresh (attempt ${retryCount}/${MAX_RETRY_ATTEMPTS}) after ${delay}ms`);

			// Wait before the next retry
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}

	// This should never be reached due to the while loop condition
	return false;
}
