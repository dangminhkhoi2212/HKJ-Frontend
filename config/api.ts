import axios, { AxiosRequestConfig } from "axios";
import { Storage } from "react-jhipster";

const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_API_URL;

const setupAxiosInterceptors = (onUnauthenticated: () => void) => {
  const onRequestSuccess = (config: any) => {
    const token =
      Storage.local.get("jhi-authenticationToken") ||
      Storage.session.get("jhi-authenticationToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  };
  const onResponseSuccess = (response: any) => response;
  const onResponseError = (err: { status: any; response: { status: any } }) => {
    const status = err.status || (err.response ? err.response.status : 0);
    if (status === 401) {
      onUnauthenticated();
    }
    return Promise.reject(err);
  };
  axios.interceptors.request.use(onRequestSuccess);
  axios.interceptors.response.use(onResponseSuccess, onResponseError);
};

export default setupAxiosInterceptors;
