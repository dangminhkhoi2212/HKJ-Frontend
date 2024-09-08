import axiosInterceptor from "@/config/axiosInterceptor";
import { LANGUAGE_KEY } from "@/config/key";
import { TFormBasic } from "@/types/account.type";
import axios from "axios";
export const updateAccountBasic = async (data: TFormBasic) => {
  const KEYCLOAK_ADMIN_URL = process.env.NEXT_PUBLIC_KEYCLOAK_ADMIN_URL;
  console.log("🚀 ~ KEYCLOAK_ADMIN_URL:", KEYCLOAK_ADMIN_URL);
  const KEYCLOAK_REALMS = process.env.NEXT_PUBLIC_KEYCLOAK_REALMS;
  console.log("🚀 ~ KEYCLOAK_CLIENT_ID:", KEYCLOAK_REALMS);
  const url: string = `${KEYCLOAK_ADMIN_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALMS}/users/${data.id}`;
  console.log("🚀 ~ updateAccountBasic ~ url:", url);
  return (
    await axios.put(url, data, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  ).data;
};
export const getAccount = async () => {
  return (await axiosInterceptor().get("/account")).data;
};
export const signOut = async () => {
  await axiosInterceptor().post("/logout");
};
