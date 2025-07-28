import axios, { AxiosError, AxiosRequestConfig } from "axios";

// Create axios instance with default configuration
const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	withCredentials: true,
	timeout: 10000, // 10 seconds timeout
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

// Track if a token refresh is already in progress
let isRefreshing = false;
// Store pending requests that should be retried after token refresh
let pendingRequests: Array<{
	resolve: (value: unknown) => void;
	reject: (reason?: any) => void;
	config: AxiosRequestConfig;
}> = [];

// Function to process pending requests
const processPendingRequests = (error: AxiosError | null = null) => {
	if (error) {
		// If refresh failed, reject all pending requests
		pendingRequests.forEach((request) => {
			request.reject(error);
		});
	} else {
		// If refresh succeeded, retry all pending requests
		pendingRequests.forEach((request) => {
			axiosInstance(request.config)
				.then((response) => request.resolve(response))
				.catch((err) => request.reject(err));
		});
	}

	// Clear pending requests
	pendingRequests = [];
};

// Request interceptor for adding headers, etc.
axiosInstance.interceptors.request.use(
	(config) => {
		// You can add common headers or other request modifications here
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

		// Only handle 401 Unauthorized errors
		if (error.response?.status !== 401 || originalRequest._retry) {
			return Promise.reject(error);
		}

		// Mark this request as retried to prevent infinite loops
		originalRequest._retry = true;

		// If a refresh is already in progress, queue this request
		if (isRefreshing) {
			return new Promise((resolve, reject) => {
				pendingRequests.push({
					resolve,
					reject,
					config: originalRequest,
				});
			});
		}

		// Start refreshing token
		isRefreshing = true;

		try {
			// Import refreshToken dynamically to avoid circular dependency
			const { refreshToken } = await import("./refresh-token");
			const refreshSuccess = await refreshToken();

			if (refreshSuccess) {
				// Process any pending requests
				processPendingRequests();

				// Retry the original request
				return axiosInstance(originalRequest);
			} else {
				// If refresh failed, reject all pending requests
				processPendingRequests(error);
				return Promise.reject(error);
			}
		} catch (refreshError) {
			// If refresh throws an error, reject all pending requests
			processPendingRequests(error);
			return Promise.reject(refreshError);
		} finally {
			isRefreshing = false;
		}
	},
);

export default axiosInstance;
