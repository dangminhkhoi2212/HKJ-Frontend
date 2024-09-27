import axiosInterceptor from "@/config/axiosInterceptor";
import { TQuery } from "@/types";
import { THire } from "@/types/hireType";

const interceptor = axiosInterceptor();
export const get = async (query: TQuery<undefined>) => {
  return (await interceptor.get("/hkj-hires", { params: query })).data;
};
export const getCount = async (query: TQuery<undefined>) => {
  return (await interceptor.get("/hkj-hires/count", { params: query })).data;
};
export const create = async (data: THire): Promise<THire> => {
  return (await interceptor.post("/hkj-hires", data)).data;
};
const hireService = {
  get,
  create,
  getCount,
};
export default hireService;
