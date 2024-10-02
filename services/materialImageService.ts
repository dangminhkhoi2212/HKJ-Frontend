import axiosInterceptor from "@/config/axiosInterceptor";
import { TMaterialImageAdd } from "@/types/materialImageType";

const interceptor = axiosInterceptor();

const create = async (data: TMaterialImageAdd) => {
  return (await interceptor.post(`/hkj-material-images`, data)).data;
};
const deleteOne = async (id: number) => {
  return (await interceptor.delete(`/hkj-material-images/${id}`)).data;
};
const materialImageService = {
  create,
  deleteOne,
};
export default materialImageService;
