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
import { useSession, getSession } from "next-auth/react";
const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_API_URL;
function getCSRF() {
  var name = "XSRF-TOKEN=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1);
    if (c.indexOf(name) !== -1) return c.substring(name.length, c.length);
  }
  return "";
}
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
