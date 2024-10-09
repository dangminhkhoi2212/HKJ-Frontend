import axiosInterceptor from "@/config/axiosInterceptor";
import { TQuery, TTemplate, TTemplateCreate, TTemplateUpdate } from "@/types";
import { formatUtil } from "@/utils";

const interceptor = axiosInterceptor();
export const get = async (query: TQuery<{}>) => {
  return (
    await interceptor.get("/hkj-templates", {
      params: formatUtil.objectOneDegree(query),
    })
  ).data;
};
export const getCount = async (query: TQuery<{}>) => {
  return (
    await interceptor.get("/hkj-templates/count", {
      params: formatUtil.objectOneDegree(query),
    })
  ).data;
};
export const update = async (data: TTemplateUpdate) => {
  return (await interceptor.put(`/hkj-templates/${data.id}`, data)).data;
};
export const deleteOne = async (id: number) => {
  return (
    await interceptor.patch(`/hkj-templates/${id}`, { id, isDeleted: true })
  ).data;
};
export const create = async (data: TTemplateCreate): Promise<TTemplate> => {
  return (
    await interceptor.post("/hkj-templates", { ...data, isDeleted: false })
  ).data;
};
const templateService = {
  get,
  create,
  getCount,
  update,
  deleteOne,
};
export default templateService;
