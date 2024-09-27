import axiosInterceptor from "@/config/axiosInterceptor";
import { TPageType } from "@/types/pageType";
import { TPosition } from "@/types/postionType";

const create = async (data: TPosition) => {
  return (await axiosInterceptor().post("/hkj-positions", data)).data;
};
const get = async (query?: TPageType) => {
  return (await axiosInterceptor().get("/hkj-positions", { params: query }))
    .data;
};
const getCount = async (query?: TPageType) => {
  return (
    await axiosInterceptor().get("/hkj-positions/count", { params: query })
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
