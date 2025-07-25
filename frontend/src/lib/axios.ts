import axios, { AxiosError } from "axios";
import { refreshToken } from "./refresh-token";

const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	headers: { "Content-Type": "application/json" },
	withCredentials: true,
});

function createAxiosResponseInterceptor() {
	const interceptor = axiosInstance.interceptors.response.use(
		(response) => response,
		async (error: AxiosError) => {
			if (error.response?.status !== 401) {
				return Promise.reject(error);
			}

			axiosInstance.interceptors.response.eject(interceptor);

			const ok = await refreshToken();

			if (ok && error.config) {
				return axiosInstance(error.config);
			}

			return Promise.reject(error);
		},
	);
}

createAxiosResponseInterceptor();

export default axiosInstance;
