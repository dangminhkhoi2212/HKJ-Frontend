import axiosInterceptor from "@/config/axiosInterceptor";
import { TAccountSync } from "@/types";

const interceptor = axiosInterceptor();
const create = async (data: TAccountSync) => {
  return (await interceptor.post("/user-extras/sync", data)).data;
};

const useExtraService = {
  create,
};
export default useExtraService;
