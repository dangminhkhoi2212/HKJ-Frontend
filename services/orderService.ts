import axiosInterceptor from "@/config/axiosInterceptor";
import {
	TOrder,
	TOrderCreate,
	TOrderQuery,
	TOrderUpdate,
	TQuery,
} from "@/types";
import { formatUtil } from "@/utils";

const interceptor = axiosInterceptor();
const get = async (query: TQuery<TOrderQuery>): Promise<TOrder[]> => {
	return (
		await interceptor.get("/hkj-orders", {
			params: formatUtil.objectOneDegree(query),
		})
	).data;
};
const getOne = async (id: number | string): Promise<TOrder> => {
	return (await interceptor.get(`/hkj-orders/${id}`)).data;
};
const getCount = async (query: TQuery<TOrderQuery>): Promise<number> => {
	return (
		await interceptor.get("/hkj-orders/count", {
			params: formatUtil.objectOneDegree(query),
		})
	).data;
};
const update = async (data: TOrderUpdate) => {
	return (await interceptor.put(`/hkj-orders/${data.id}`, data)).data;
};
const updatePartical = async (data: TOrderUpdate) => {
	return (await interceptor.patch(`/hkj-orders/${data.id}`, data)).data;
};
const deleteOne = async (id: number) => {
	return (
		await interceptor.patch(`/hkj-orders/${id}`, {
			id,
			isDeleted: true,
		})
	).data;
};
const create = async (data: TOrderCreate): Promise<TOrder> => {
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
	updatePartical,
};
export default orderService;
