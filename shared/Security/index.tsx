"use client";
import { AUTH_TOKEN_KEY } from "@/config/key";
import { useAccount } from "@/hooks/account";
import routes from "@/routes";
import useAccountStore from "@/stores/account";
import { get } from "local-storage";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { excludedPaths } from "@/middleware";
const Security: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const token = Cookies.get(AUTH_TOKEN_KEY);
  const account = useAccountStore((state) => state.account);
  const { refetch: getAccount } = useAccount();

  useEffect(() => {
    if (!excludedPaths.includes(pathname)) {
      if (!token) router.push(routes.signIn);
      if (!account) getAccount();
    }
  }, [account, getAccount, pathname, router, token]);

  return <>{children}</>;
};

export default Security;
