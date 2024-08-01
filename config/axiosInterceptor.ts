import { ConfigProvider } from "antd";
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import { get } from "local-storage";
import Cookies from "js-cookie";
import { AUTH_TOKEN_KEY } from "./key";
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
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      const token: string | undefined = Cookies.get(AUTH_TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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
