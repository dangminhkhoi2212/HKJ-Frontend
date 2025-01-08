import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_API_URL;

const headers = {
	Accept: "application/json",
	"Access-Control-Allow-Origin": "*",
	"ngrok-skip-browser-warning": true,
};
const axiosInterceptor = () => {
	const instance = axios.create({
		baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
		headers,
	});

	instance.interceptors.request.use(
		async (
			config: InternalAxiosRequestConfig
		): Promise<InternalAxiosRequestConfig> => {
			const session = await getSession();
			// console.log("🚀 ~ axiosInterceptor ~ session:", session);
			const accessToken = session?.access_token;
			if (accessToken) {
				config.headers.Authorization = `Bearer ${accessToken}`;
			}
			return config;
		}
	);

	instance.interceptors.response.use((response: AxiosResponse) => {
		return response;
	});

	return instance;
};

export default axiosInterceptor;
