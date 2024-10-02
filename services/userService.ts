import axiosInterceptor from "@/config/axiosInterceptor";
import { AUTHORIZATIONS_CONST } from "@/const";
import { TAccontQuery, TAccountInfo } from "@/types";

import { TQuery } from "../types/queryType";

const { AUTHORIZATIONS } = AUTHORIZATIONS_CONST;
const defaultRole = AUTHORIZATIONS.ROLE_USER.toString();
const getUsersByRole = async (
  query?: TQuery<TAccontQuery>
): Promise<TAccountInfo[]> => {
  return (
    await axiosInterceptor().get(`/users/role`, {
      params: { ...query, role: query?.role?.toString() || defaultRole },
    })
  ).data;
};
const getUsersByRoleCount = async (
  query?: TQuery<TAccontQuery>
): Promise<number> => {
  return (
    await axiosInterceptor().get(`/users/role/count`, {
      params: { ...query, role: query?.role.toString() || defaultRole },
    })
  ).data;
};
const userService = { getUsersByRole, getUsersByRoleCount };
export default userService;
