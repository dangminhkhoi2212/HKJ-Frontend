import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";
const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_API_URL;

const headers = {
  Accept: "application/json",
  "Access-Control-Allow-Origin": "*",
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
