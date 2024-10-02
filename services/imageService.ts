import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";

const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;
export type TImageResponse = {
  url: string;
  success: boolean;
  message: string;
};
const headers = {
  Accept: "application/json",
  "Access-Control-Allow-Origin": "*",
};
const axiosInterceptor = () => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_AI,
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
const intereptor = axiosInterceptor();
const upload = async (file: File): Promise<TImageResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  return (
    await intereptor.post("/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  ).data;
};
const deleteImages = async (data: string[]) => {
  return (await intereptor.post("/delete-images", { files: data })).data;
};
const imageService = {
  upload,
  deleteImages,
};

export default imageService;
