import axiosInterceptor from '@/config/axiosInterceptor';
import { TQuery } from '@/types';
import { TJewelryImage, TJewelryImageCreate } from '@/types/jewelryImageType';
import { TJewelry } from '@/types/jewelryType';
import { formatUtil } from '@/utils';

const interceptor = axiosInterceptor();
 const get = async (query: TQuery<TJewelry>): Promise<TJewelry[]> => {
  return (
    await interceptor.get("/hkj-jewelry-images", {
      params: formatUtil.objectOneDegree(query),
    })
  ).data;
};
 const getCount = async (query: TQuery<TJewelry>): Promise<number> => {
  return (
    await interceptor.get("/hkj-jewelry-images/count", {
      params: formatUtil.objectOneDegree(query),
    })
  ).data;
};
 const update = async (data: TJewelry) => {
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
    await interceptor.post("/hkj-jewelry-images", { ...data, isDeleted: false })
  ).data;
};
const createMutiple = async (data: TJewelryImageCreate[]): Promise<TJewelryImage[]> => {
  return await Promise.all(data.map(async (item) => await create(item)));
}


const jewelryImageService = {
  get,
  create,
  getCount,
  update,
  deleteOne,createMutiple
};
 export default jewelryImageService;
