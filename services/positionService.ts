import axiosInterceptor from "@/config/axiosInterceptor";
import { TQuery } from "@/types";
import { TPageType } from "@/types/pageType";
import { TPosition, TPositionQuery } from "@/types/postionType";
import { formatUtil } from "@/utils";

const create = async (data: TPosition) => {
  return (await axiosInterceptor().post("/hkj-positions", data)).data;
};
const get = async (query: TQuery<TPositionQuery>) => {
  return (
    await axiosInterceptor().get("/hkj-positions", {
      params: formatUtil.objectOneDegree(query),
    })
  ).data;
};
const getCount = async (query: TPageType) => {
  return (
    await axiosInterceptor().get("/hkj-positions/count", {
      params: formatUtil.objectOneDegree(query),
    })
  ).data;
};
const deletePosition = async (id: number) => {
  return (await axiosInterceptor().delete(`/hkj-positions/${id}`)).data;
};
const update = async (data: TPosition) => {
  console.log("🚀 ~ update ~ data:", data);
  return (await axiosInterceptor().patch(`/hkj-positions/${data.id}`, data))
    .data;
};
const positonService = { create, get, deletePosition, update, getCount };

export default positonService;
