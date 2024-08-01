import axiosInterceptor from "@/config/axiosInterceptor";
import { LANGUAGE_KEY } from "@/config/key";
import { TResetPasswordFormApi, TSignIn, TSignUp } from "@/types/account.type";

export const signIn = async (data: TSignIn): Promise<String> => {
  return (await axiosInterceptor().post("/authenticate", data)).data;
};
export const resetPassword = async (email: string) => {
  return (
    await axiosInterceptor().post("/account/reset-password/init", email, {
      headers: {
        "Content-Type": "text/plain", // Ensure the correct Content-Type is set
      },
    })
  ).data;
};
export const resetPasswordFinish = async (data: TResetPasswordFormApi) => {
  return (await axiosInterceptor().post("/account/reset-password/finish", data))
    .data;
};
export const signUp = async (data: TSignUp): Promise<String> => {
  return (
    await axiosInterceptor().post("/register", {
      ...data,
      langKey: LANGUAGE_KEY,
    })
  ).data;
};
export const getAccount = async () => {
  return (await axiosInterceptor().get("/account")).data;
};
