"use client";
import { AUTH_TOKEN_KEY } from "@/config/key";
import routes from "@/routes";
import { get, remove } from "local-storage";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
const useAccountButtonActions = () => {
  const router = useRouter();
  const clearAuthToken = () => {
    if (Cookies.get(AUTH_TOKEN_KEY)) {
      Cookies.remove(AUTH_TOKEN_KEY);
    }
  };
  const signOut = () => {
    clearAuthToken();
    router.push(routes.signIn);
  };
  return { signOut, clearAuthToken };
};
export default useAccountButtonActions;
