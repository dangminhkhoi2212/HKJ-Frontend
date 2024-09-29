import axiosInterceptor from "@/config/axiosInterceptor";
import { TQuery } from "@/types";
import { THire, THireQuery } from "@/types/hireType";
import { formatUtil } from "@/utils";

const interceptor = axiosInterceptor();
export const get = async (query: TQuery<THireQuery>) => {
  return (
    await interceptor.get("/hkj-hires", {
      params: formatUtil.objectOneDegree(query),
    })
  ).data;
};
export const getCount = async (query: TQuery<THireQuery>) => {
  return (
    await interceptor.get("/hkj-hires/count", {
      params: formatUtil.objectOneDegree(query),
    })
  ).data;
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
