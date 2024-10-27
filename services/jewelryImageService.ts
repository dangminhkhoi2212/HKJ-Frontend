import axiosInterceptor from "@/config/axiosInterceptor";
import {
	TJewelryImage,
	TJewelryImageCreate,
	TJewelryImageQuery,
	TQuery,
} from "@/types";
import { formatUtil } from "@/utils";

const interceptor = axiosInterceptor();
const get = async (
	query: TQuery<TJewelryImageQuery>
): Promise<TJewelryImage[]> => {
	return (
		await interceptor.get("/hkj-jewelry-images", {
			params: formatUtil.objectOneDegree({ ...query }),
		})
	).data;
};
const getCount = async (query: TQuery<TJewelryImageQuery>): Promise<number> => {
	return (
		await interceptor.get("/hkj-jewelry-images/count", {
			params: formatUtil.objectOneDegree(query),
		})
	).data;
};
const update = async (data: TJewelryImage) => {
	return (await interceptor.put(`/hkj-jewelry-images/${data.id}`, data)).data;
};
const deleteOne = async (id: number) => {
	return (
		await interceptor.patch(`/hkj-jewelry-images/${id}`, {
			id,
			isDeleted: true,
		})
	).data;
};
const create = async (data: TJewelryImageCreate): Promise<TJewelryImage> => {
	return (
		await interceptor.post("/hkj-jewelry-images", {
			...data,
			isDeleted: false,
		})
	).data;
};
const createMultiple = async (
	data: TJewelryImageCreate[]
): Promise<TJewelryImage[]> => {
	return await Promise.all(data.map(async (item) => await create(item)));
};
const deleteMultiple = async (ids: number[]) => {
	return await Promise.all(ids.map(async (item) => await deleteOne(item)));
};
const jewelryImageService = {
	get,
	create,
	getCount,
	update,
	deleteOne,
	createMultiple,
	deleteMultiple,
};
export default jewelryImageService;
