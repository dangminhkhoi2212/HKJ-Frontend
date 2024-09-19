import axiosInterceptor from "@/config/axiosInterceptor";
import { LANGUAGE_KEY } from "@/const/key";
import { TFormBasic } from "@/types/account.type";
import { TPageType } from "@/types/page.type";
import { TPosition, TPositionCreate } from "@/types/postion.type";

const create = async (data: TPositionCreate) => {
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
const positonService = () => {
  return { create, get, deletePosition, update, getCount };
};
export default positonService();
