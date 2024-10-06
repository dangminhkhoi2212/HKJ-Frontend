import axiosInterceptor from "@/config/axiosInterceptor";
import { TCategory, TQuery } from "@/types";
import { formatUtil } from "@/utils";

const interceptor = axiosInterceptor();
export const get = async (query: TQuery<{}>) => {
  return (
    await interceptor.get("/hkj-categories", {
      params: formatUtil.objectOneDegree(query),
    })
  ).data;
};
export const getCount = async (query: TQuery<{}>) => {
  return (
    await interceptor.get("/hkj-categories/count", {
      params: formatUtil.objectOneDegree(query),
    })
  ).data;
};
export const update = async (data: TCategory) => {
  return (await interceptor.put(`/hkj-categories/${data.id}`, data)).data;
};
export const create = async (
  data: Omit<TCategory, "id">
): Promise<TCategory> => {
  return (
    await interceptor.post("/hkj-categories", { ...data, isDeleted: false })
  ).data;
};
const categoryService = {
  get,
  create,
  getCount,
  update,
};
export default categoryService;
