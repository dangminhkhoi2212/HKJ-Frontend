import axiosInterceptor from "@/config/axiosInterceptor";

export const getAccount = async () => {
  return (await axiosInterceptor().get("/account")).data;
};

const accountService = {
  getAccount,
};
export default accountService;
