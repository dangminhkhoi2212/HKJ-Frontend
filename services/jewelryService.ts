import axiosInterceptor from "@/config/axiosInterceptor";
import {
	TJewelry,
	TJewelryCreate,
	TJewelryUpdate,
	TJewelryUpdatePartical,
	TQuery,
} from "@/types";
import { formatUtil } from "@/utils";

const interceptor = axiosInterceptor();
export const get = async (query: TQuery<{}>): Promise<TJewelry[]> => {
	return (
		await interceptor.get("/hkj-jewelry-models", {
			params: formatUtil.objectOneDegree(query),
		})
	).data;
};
const getOne = async (id: number): Promise<TJewelry> => {
	return (await axiosInterceptor().get(`/hkj-jewelry-models/${id}`, {})).data;
};
export const getCount = async (query: TQuery<{}>): Promise<number> => {
	return (
		await interceptor.get("/hkj-jewelry-models/count", {
			params: formatUtil.objectOneDegree(query),
		})
	).data;
};
export const update = async (data: TJewelryUpdate) => {
	return (await interceptor.put(`/hkj-jewelry-models/${data.id}`, data)).data;
};
export const updatePartical = async (data: TJewelryUpdatePartical) => {
	const dataConvert = data?.project?.id
		? { id: data.id, project: data.project }
		: data;
	return (
		await interceptor.patch(`/hkj-jewelry-models/${data.id}`, dataConvert)
	).data;
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
	getOne,
	updatePartical,
};
export default jewelryService;
