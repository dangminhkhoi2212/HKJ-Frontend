import axiosInterceptor from "@/config/axiosInterceptor";
import {
	TOrderItem,
	TOrderItemCreate,
	TOrderItemQuery,
	TOrderItemUpdate,
	TQuery,
} from "@/types";
import { formatUtil } from "@/utils";

const interceptor = axiosInterceptor();
const get = async (query: TQuery<TOrderItemQuery>): Promise<TOrderItem[]> => {
	return (
		await interceptor.get("/hkj-order-items", {
			params: formatUtil.objectOneDegree({ ...query }),
		})
	).data;
};
const getCount = async (query: TQuery<TOrderItemQuery>): Promise<number> => {
	return (
		await interceptor.get("/hkj-order-items/count", {
			params: formatUtil.objectOneDegree(query),
		})
	).data;
};
const update = async (data: TOrderItem) => {
	return (await interceptor.put(`/hkj-order-items/${data.id}`, data)).data;
};
const updatePartical = async (data: TOrderItemUpdate) => {
	return (await interceptor.patch(`/hkj-order-items/${data.id}`, data)).data;
};
const deleteOne = async (id: number) => {
	return (
		await interceptor.patch(`/hkj-order-items/${id}`, {
			id,
			isDeleted: true,
		})
	).data;
};
const create = async (data: TOrderItemCreate): Promise<TOrderItem> => {
	return (
		await interceptor.post("/hkj-order-items", {
			...data,
			isDeleted: false,
		})
	).data;
};
const createMultiple = async (
	data: TOrderItemCreate[]
): Promise<TOrderItem[]> => {
	return await Promise.all(data.map(async (item) => await create(item)));
};
const deleteMultiple = async (ids: number[]) => {
	return await Promise.all(ids.map(async (item) => await deleteOne(item)));
};
const orderItemService = {
	get,
	create,
	getCount,
	update,
	deleteOne,
	createMultiple,
	deleteMultiple,
	updatePartical,
};
export default orderItemService;
