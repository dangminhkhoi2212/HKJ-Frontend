import axiosInterceptor from "@/config/axiosInterceptor";
import {
  TQuery,
  TTemplateStep,
  TTemplateStepCreate,
  TTemplateStepQuery,
} from "@/types";
import { formatUtil } from "@/utils";

const interceptor = axiosInterceptor();
export const get = async (query: TQuery<TTemplateStepQuery>) => {
  return (
    await interceptor.get("/hkj-template-steps", {
      params: formatUtil.objectOneDegree(query),
    })
  ).data;
};
export const getCount = async (query: TQuery<TTemplateStepQuery>) => {
  return (
    await interceptor.get("/hkj-template-steps/count", {
      params: formatUtil.objectOneDegree(query),
    })
  ).data;
};
export const update = async (data: TTemplateStep) => {
  return (await interceptor.put(`/hkj-template-steps/${data.id}`, data)).data;
};
export const deleteOne = async (id: number) => {
  return (
    await interceptor.patch(`/hkj-template-steps/${id}`, {
      id,
      isDeleted: true,
    })
  ).data;
};
export const create = async (
  data: TTemplateStepCreate
): Promise<TTemplateStep> => {
  return (
    await interceptor.post("/hkj-template-steps", { ...data, isDeleted: false })
  ).data;
};
const templateStepService = {
  get,
  create,
  getCount,
  update,
  deleteOne,
};
export default templateStepService;
