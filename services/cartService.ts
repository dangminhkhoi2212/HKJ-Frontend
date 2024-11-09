import axiosInterceptor from "@/config/axiosInterceptor";
import { TJewelry, TJewelryCreate, TJewelryCRUD, TQuery } from "@/types";
import { formatUtil } from "@/utils";

const interceptor = axiosInterceptor();
export const get = async (query: TQuery<{}>): Promise<TJewelry[]> => {
	return (
		await interceptor.get("/hkj-carts", {
			params: formatUtil.objectOneDegree(query),
		})
	).data;
};
const getOne = async (id: number | string): Promise<TJewelry> => {
	return (
		await axiosInterceptor().get(`/hkj-carts/${id}`, {
			params: { isDeleted: false },
		})
	).data;
};
export const getCount = async (query: TQuery<{}>): Promise<number> => {
	return (
		await interceptor.get("/hkj-carts/count", {
			params: formatUtil.objectOneDegree(query),
		})
	).data;
};
export const update = async (data: TJewelryCRUD) => {
	return (await interceptor.put(`/hkj-carts/${data.id}`, data)).data;
};
export const updatePartical = async (data: Partial<TJewelryCRUD>) => {
	return (await interceptor.patch(`/hkj-carts/${data.id}`, data)).data;
};
export const deleteOne = async (id: number) => {
	return (
		await interceptor.patch(`/hkj-carts/${id}`, {
			id,
			isDeleted: true,
		})
	).data;
};
export const create = async (data: TJewelryCreate): Promise<TJewelry> => {
	return (
		await interceptor.post("/hkj-carts", {
			...data,
			isDeleted: false,
		})
	).data;
};
const jewelryService = {
	get,
	create,
	getCount,
	update,
	deleteOne,
	getOne,
	updatePartical,
};
export default jewelryService;
