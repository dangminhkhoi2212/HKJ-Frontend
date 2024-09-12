import axiosInterceptor from "@/config/axiosInterceptor";
import { LANGUAGE_KEY } from "@/const/key";
import { TFormBasic } from "@/types/account.type";

export const getAccount = async () => {
  return (await axiosInterceptor().get("/account")).data;
};
export const signOut = async () => {
  await axiosInterceptor().post("/logout");
};
