import axios, { type AxiosError } from "axios";

// Create axios instance
const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	headers: { "Content-Type": "application/json" },
	withCredentials: true,
});

function createAxiosResponseInterceptor() {
	const interceptor = axios.interceptors.response.use(
		(response) => response,
		(error: AxiosError) => {
			// Reject promise if usual error
			if (error.response?.status !== 401) {
				return Promise.reject(error);
			}

			/*
			 * When response code is 401, try to refresh the token.
			 * Eject the interceptor so it doesn't loop in case
			 * token refresh causes the 401 response.
			 *
			 * Must be re-attached later on or the token refresh will only happen once
			 */
			axios.interceptors.response.eject(interceptor);

			return axiosInstance
				.get("/auth/refresh-token")
				.then(() => console.log("Refreshed successfully"))
				.catch((error2) => {
					// Retry failed, clean up and reject the promise
					window.location.href = "/login";
					return Promise.reject(error2);
				})
				.finally(createAxiosResponseInterceptor); // Re-attach the interceptor by running the method
		},
	);
}

createAxiosResponseInterceptor();

export default axiosInstance;
