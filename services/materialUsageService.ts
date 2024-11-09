import axiosInterceptor from "@/config/axiosInterceptor";
import {
	TMaterialUsage,
	TMaterialUsageCreate,
	TMaterialUsageQuery,
	TMaterialUsageUpdate,
	TQuery,
} from "@/types";
import { formatUtil } from "@/utils";

const interceptor = axiosInterceptor();

const create = async (data: TMaterialUsageCreate) => {
	return (await interceptor.post(`/hkj-material-usages`, data)).data;
};
const get = async (query: TQuery<TMaterialUsageQuery>) => {
	return (
		await interceptor.get("/hkj-material-usages", {
			params: formatUtil.objectOneDegree(query),
		})
	).data;
};
const getOne = async (id: string | number): Promise<TMaterialUsage> => {
	return (await interceptor.get(`/hkj-material-usages/${id}`)).data;
};
const getCount = async (query: TQuery<TMaterialUsageQuery>) => {
	return (
		await interceptor.get("/hkj-material-usages/count", {
			params: formatUtil.objectOneDegree(query),
		})
	).data;
};
const update = async (data: TMaterialUsageUpdate) => {
	return (await interceptor.patch(`/hkj-material-usages/${data.id}`, data))
		.data;
};
const deleteMaterialUsage = async (id: number) => {
	return (await interceptor.delete(`/hkj-material-usages/${id}`)).data;
};
const createMultiple = async (data: TMaterialUsageCreate[]) => {
	return await Promise.all(data.map(async (item) => await create(item)));
};
const updateMultiple = async (data: TMaterialUsageUpdate[]) => {
	return await Promise.all(data.map(async (item) => await update(item)));
};
const deleteMultiple = async (ids: number[]) => {
	return await Promise.all(
		ids.map(async (item) => await deleteMaterialUsage(item))
	);
};
const materialService = {
	create,
	get,
	getCount,
	update,
	getOne,
	updateMultiple,
	createMultiple,
	deleteMultiple,
};
export default materialService;
