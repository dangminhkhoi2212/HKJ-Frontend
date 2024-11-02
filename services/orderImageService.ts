import axiosInterceptor from "@/config/axiosInterceptor";
import {
	TOrderImage,
	TOrderImageCreate,
	TOrderImageQuery,
	TQuery,
} from "@/types";
import { formatUtil } from "@/utils";

const interceptor = axiosInterceptor();
const get = async (query: TQuery<TOrderImageQuery>): Promise<TOrderImage[]> => {
	return (
		await interceptor.get("/hkj-order-images", {
			params: formatUtil.objectOneDegree({ ...query }),
		})
	).data;
};
const getCount = async (query: TQuery<TOrderImage>): Promise<number> => {
	return (
		await interceptor.get("/hkj-order-images/count", {
			params: formatUtil.objectOneDegree(query),
		})
	).data;
};
const update = async (data: TOrderImage) => {
	return (await interceptor.put(`/hkj-order-images/${data.id}`, data)).data;
};
const deleteOne = async (id: number) => {
	return (
		await interceptor.patch(`/hkj-order-images/${id}`, {
			id,
			isDeleted: true,
		})
	).data;
};
const create = async (data: TOrderImageCreate): Promise<TOrderImage> => {
	return (
		await interceptor.post("/hkj-order-images", {
			...data,
			isDeleted: false,
		})
	).data;
};
const createMultiple = async (
	data: TOrderImageCreate[]
): Promise<TOrderImage[]> => {
	return await Promise.all(data.map(async (item) => await create(item)));
};
const deleteMultiple = async (ids: number[]) => {
	return await Promise.all(ids.map(async (item) => await deleteOne(item)));
};
const orderImageService = {
	get,
	create,
	getCount,
	update,
	deleteOne,
	createMultiple,
	deleteMultiple,
};
export default orderImageService;
