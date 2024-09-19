import { TEmployees } from "@/app/(group)/manager/employees/action";
import axiosInterceptor from "@/config/axiosInterceptor";
import { AUTHORIZATIONS } from "@/const/authorities";
import { TResponse } from "@/types/response.type";

const userService = () => {
  const getUsersByRole = async (
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

  return { getUsersByRole };
};
export default userService();
