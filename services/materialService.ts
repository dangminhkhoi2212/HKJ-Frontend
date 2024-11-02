import axiosInterceptor from '@/config/axiosInterceptor';
import { TMaterial, TMaterialAdd, TMaterialQuery, TMaterialUpadate, TQuery } from '@/types';
import { formatUtil } from '@/utils';

const interceptor = axiosInterceptor();

const create = async (data: TMaterialAdd) => {
	return (await interceptor.post(`/hkj-materials`, data)).data;
};
const get = async (query: TQuery<TMaterialQuery>) => {
	return (
		await axiosInterceptor().get("/hkj-materials", {
			params: formatUtil.objectOneDegree(query),
		})
	).data;
};
const getOne = async (id: string | number): Promise<TMaterial> => {
	return (await axiosInterceptor().get(`/hkj-materials/${id}`)).data;
};
const getCount = async (query: TQuery<TMaterialQuery>) => {
	return (
		await axiosInterceptor().get("/hkj-materials/count", {
			params: formatUtil.objectOneDegree(query),
		})
	).data;
};
const update = async (data: TMaterialUpadate) => {
	return (await axiosInterceptor().patch(`/hkj-materials/${data.id}`, data))
		.data;
};
const materialService = {
	create,
	get,
	getCount,
	update,
	getOne,
};
export default materialService;
