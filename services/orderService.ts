import axiosInterceptor from "@/config/axiosInterceptor";
import {
	TOrder,
	TOrderCreate,
	TOrderQuery,
	TProjectUpdate,
	TQuery,
} from "@/types";
import { formatUtil } from "@/utils";

const interceptor = axiosInterceptor();
export const get = async (query: TQuery<TOrderQuery>): Promise<TOrder[]> => {
	return (
		await interceptor.get("/hkj-orders", {
			params: formatUtil.objectOneDegree(query),
		})
	).data;
};
export const getOne = async (id: number | string): Promise<TOrder> => {
	return (await interceptor.get(`/hkj-orders/${id}`)).data;
};
export const getCount = async (query: TQuery<TOrderQuery>): Promise<number> => {
	return (
		await interceptor.get("/hkj-orders/count", {
			params: formatUtil.objectOneDegree(query),
		})
	).data;
};
export const update = async (data: TProjectUpdate) => {
	return (await interceptor.put(`/hkj-orders/${data.id}`, data)).data;
};

export const deleteOne = async (id: number) => {
	return (
		await interceptor.patch(`/hkj-orders/${id}`, {
			id,
			isDeleted: true,
		})
	).data;
};
export const create = async (data: TOrderCreate): Promise<TOrder> => {
	return (
		await interceptor.post("/hkj-orders", {
			...data,
			isDeleted: false,
		})
	).data;
};
const orderService = {
	get,
	create,
	getCount,
	update,
	deleteOne,
	getOne,
};
export default orderService;
