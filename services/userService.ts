import axiosInterceptor from "@/config/axiosInterceptor";
import { TAccontQuery, TAccountInfo } from "@/types";

import { TQuery } from "../types/queryType";

const getUsersByRole = async (
  query?: TQuery<TAccontQuery>
): Promise<TAccountInfo[]> => {
  return (
    await axiosInterceptor().get(`/users/role`, {
      params: { ...query, role: query?.role.toString() },
    })
  ).data;
};
const getUsersByRoleCount = async (
  query?: TQuery<TAccontQuery>
): Promise<number> => {
  return (
    await axiosInterceptor().get(`/users/role/count`, {
      params: { ...query, role: query?.role.toString() },
    })
  ).data;
};
const userService = { getUsersByRole, getUsersByRoleCount };
export default userService;
