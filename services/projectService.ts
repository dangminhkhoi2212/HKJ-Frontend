import axiosInterceptor from "@/config/axiosInterceptor";
import { TProject, TProjectCreate, TProjectUpdate, TQuery } from "@/types";
import { formatUtil } from "@/utils";

const interceptor = axiosInterceptor();
export const get = async (query: TQuery<{}>): Promise<TProject[]> => {
	return (
		await interceptor.get("/hkj-projects", {
			params: formatUtil.objectOneDegree(query),
		})
	).data;
};
export const getOne = async (id: number | string): Promise<TProject> => {
	return (await interceptor.get(`/hkj-projects/${id}`)).data;
};
export const getCount = async (query: TQuery<{}>): Promise<number> => {
	return (
		await interceptor.get("/hkj-projects/count", {
			params: formatUtil.objectOneDegree(query),
		})
	).data;
};
export const update = async (data: TProjectUpdate) => {
	return (await interceptor.put(`/hkj-projects/${data.id}`, data)).data;
};

export const deleteOne = async (id: number) => {
	return (
		await interceptor.patch(`/hkj-projects/${id}`, {
			id,
			isDeleted: true,
		})
	).data;
};
export const create = async (data: TProjectCreate): Promise<TProject> => {
	return (
		await interceptor.post("/hkj-projects", {
			...data,
			isDeleted: false,
		})
	).data;
};
const projectService = {
	get,
	create,
	getCount,
	update,
	deleteOne,
	getOne,
};
export default projectService;
