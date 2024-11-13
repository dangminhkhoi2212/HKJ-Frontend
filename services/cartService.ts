import axiosInterceptor from "@/config/axiosInterceptor";
import { TCart, TCartCRUD, TCartQuery, TQuery } from "@/types";
import { formatUtil } from "@/utils";

const interceptor = axiosInterceptor();
export const get = async (query: TQuery<TCartQuery>): Promise<TCart[]> => {
	return (
		await interceptor.get("/hkj-carts", {
			params: formatUtil.objectOneDegree(query),
		})
	).data;
};
const getOne = async (id: number | string): Promise<TCart> => {
	return (
		await axiosInterceptor().get(`/hkj-carts/${id}`, {
			params: { isDeleted: false },
		})
	).data;
};
export const getCount = async (query: TQuery<TCartQuery>): Promise<number> => {
	return (
		await interceptor.get("/hkj-carts/count", {
			params: formatUtil.objectOneDegree(query),
		})
	).data;
};
export const update = async (data: TCartCRUD) => {
	return (await interceptor.put(`/hkj-carts/${data.id}`, data)).data;
};
export const updatePartical = async (data: Partial<TCartCRUD>) => {
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
export const create = async (data: TCartCRUD): Promise<TCart> => {
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
