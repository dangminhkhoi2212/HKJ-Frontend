import axiosInterceptor from "@/config/axiosInterceptor";
import { TAccountSync, TUserExtra } from "@/types";

const interceptor = axiosInterceptor();
const create = async (data: TAccountSync) => {
	return (await interceptor.post("/user-extras/sync", data)).data;
};
const updatePartical = async (data: TUserExtra) => {
	return (await interceptor.patch(`/user-extras/${data.id}`, data)).data;
};

const useExtraService = {
	create,
	updatePartical,
};
export default useExtraService;
