"use client";
import { App } from "antd";
import { signOut } from "next-auth/react";
import { useQuery } from "react-query";

import { routes } from "@/routes";
import { getAccount } from "@/services/accountService";
import useAccountStore, { TAccountInfo } from "@/stores/account";

import { useRouterCustom } from "./router";

export const useAccount = () => {
  const { setAccount, setIsLoading } = useAccountStore((state) => state);
  const { message } = App.useApp();
  const { router } = useRouterCustom();
  const getAccountApi = useQuery("account", getAccount, {
    onSuccess: (data) => {
      console.log("🚀 ~ useAccount ~ data:", data);
      const account = data as TAccountInfo;
      setIsLoading(false);
      setAccount(account);
    },
    onError: (error) => {
      console.log(error);

      message.error("Không thể lấy thông tin tài khoản người dùng");
    },
    enabled: false,
  });
  async function keycloakSessionLogOut() {
    try {
      const res = await fetch(routes.signOut, { method: "GET" });
      console.log("🚀 ~ keycloakSessionLogOut ~ res:", res);
    } catch (err) {
      console.log("🚀 ~ keycloakSessionLogOut ~ err:", err);
    }
  }
  const signOutAll = async () => {
    try {
      await keycloakSessionLogOut();
      await signOut({ callbackUrl: routes.signIn });

      await signOut({
        callbackUrl: routes.signIn,
      });
      console.log("🚀 ~ signOutAll ~ SIGN OUT");
    } catch (error) {
      console.log("🚀 ~ signOutAll ~ error:", error);
    }
  };
  return { getAccountApi, signOutAll };
};
