import { TEmployees } from "@/app/(group)/manager/employees/page";
import axiosInterceptor from "@/config/axiosInterceptor";
import { AUTHORIZATIONS } from "@/const/authorities";
import { LANGUAGE_KEY } from "@/const/key";
import { TFormBasic } from "@/types/account.type";
import { TResponse } from "@/types/response";

export const getUsersByRole = async (
  role: string = AUTHORIZATIONS.EMPLOYEE,
  size: number = 10,
  page: number = 0,
  sort: string = "id,desc"
): Promise<TResponse<TEmployees[]>> => {
  return (
    await axiosInterceptor().get(`/users/role`, {
      params: { role, size, page, sort },
    })
  ).data;
};
