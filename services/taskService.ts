import axiosInterceptor from "@/config/axiosInterceptor";
import {
	TProjectUpdate,
	TQuery,
	TTask,
	TTaskCreate,
	TTaskQuery,
} from "@/types";
import { formatUtil } from "@/utils";

const interceptor = axiosInterceptor();
export const get = async (query: TQuery<TTaskQuery>): Promise<TTask[]> => {
	return (
		await interceptor.get("/hkj-tasks", {
			params: formatUtil.objectOneDegree(query),
		})
	).data;
};
export const getOne = async (id: number): Promise<TTask[]> => {
	return (await interceptor.get(`/hkj-tasks/${id}`)).data;
};
export const getCount = async (query: TQuery<{}>): Promise<number> => {
	return (
		await interceptor.get("/hkj-tasks/count", {
			params: formatUtil.objectOneDegree(query),
		})
	).data;
};
export const update = async (data: TProjectUpdate) => {
	return (await interceptor.put(`/hkj-tasks/${data.id}`, data)).data;
};
export const deleteOne = async (id: number) => {
	return (
		await interceptor.patch(`/hkj-tasks/${id}`, {
			id,
			isDeleted: true,
		})
	).data;
};
export const create = async (data: TTaskCreate): Promise<TTask> => {
	return (
		await interceptor.post("/hkj-tasks", {
			...data,
			isDeleted: false,
		})
	).data;
};
const taskService = {
	get,
	create,
	getCount,
	update,
	deleteOne,
	getOne,
};
export default taskService;
