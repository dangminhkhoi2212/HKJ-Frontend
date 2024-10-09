import axiosInterceptor from "@/config/axiosInterceptor";
import { TQuery } from "@/types";
import { TJewelry, TJewelryCreate } from "@/types/jewelryType";
import { formatUtil } from "@/utils";

const interceptor = axiosInterceptor();
export const get = async (query: TQuery<{}>): Promise<TJewelry[]> => {
	return (
		await interceptor.get("/hkj-jewelry-models", {
			params: formatUtil.objectOneDegree(query),
		})
	).data;
};
export const getCount = async (query: TQuery<{}>): Promise<number> => {
	return (
		await interceptor.get("/hkj-jewelry-models/count", {
			params: formatUtil.objectOneDegree(query),
		})
	).data;
};
export const update = async (data: TJewelry) => {
	return (await interceptor.put(`/hkj-jewelry-models/${data.id}`, data)).data;
};
export const deleteOne = async (id: number) => {
	return (
		await interceptor.patch(`/hkj-jewelry-models/${id}`, {
			id,
			isDeleted: true,
		})
	).data;
};
export const create = async (data: TJewelryCreate): Promise<TJewelry> => {
	return (
		await interceptor.post("/hkj-jewelry-models", {
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
};
export default jewelryService;
