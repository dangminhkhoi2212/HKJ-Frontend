import axiosInterceptor from "@/config/axiosInterceptor";
import { TQuery } from "@/types";
import {
  TMaterialImage,
  TMaterialImageAdd,
  TMaterialImageQuery,
} from "@/types/materialImageType";
import { formatUtil } from "@/utils";

const interceptor = axiosInterceptor();
const get = async (
  query: TQuery<TMaterialImageQuery>
): Promise<TMaterialImage[]> => {
  return (
    await interceptor.get(`/hkj-material-images`, {
      params: formatUtil.objectOneDegree(query),
    })
  ).data;
};
const create = async (data: TMaterialImageAdd) => {
  return (await interceptor.post(`/hkj-material-images`, data)).data;
};
const update = async (data: TMaterialImageAdd) => {
  return (await interceptor.patch(`/hkj-material-images/`, data)).data;
};
const createMultiple = async (data: TMaterialImageAdd[]) => {
  return await Promise.all(data.map(async (item) => await create(item)));
};
const deleteOne = async (id: number) => {
  return (await interceptor.delete(`/hkj-material-images/${id}`)).data;
};
const deleteMultiple = async (ids: number[]) => {
  console.log("🚀SV ~ deleteMultiple ~ ids:", ids);
  return await Promise.all(ids.map(async (item) => await deleteOne(item)));
};
const materialImageService = {
  get,
  create,
  deleteOne,
  update,
  createMultiple,
  deleteMultiple,
};
export default materialImageService;
