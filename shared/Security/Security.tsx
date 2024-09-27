"use client";
import { App } from "antd";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { useAccount } from "@/hooks/account";
import { routes } from "@/routes";
import useAccountStore from "@/stores/account";
import { TAccountInfo } from "@/types";

const Security: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { message } = App.useApp();
  const [count, setCount] = useState<number>(0);
  const account: TAccountInfo | null | undefined = useAccountStore(
    (state) => state.account
  );
  const { getAccountApi: getAccount, signOutAll } = useAccount();
  const { data: session } = useSession();
  if (session?.error == "RefreshAccessTokenError") {
    signOut({ callbackUrl: routes.signIn });
  }
  console.log("🚀 ~ session:", session);
  useEffect(() => {
    if (count > 4) return;
    if (!account && session?.access_token) {
      getAccount.refetch();
      setCount((pre) => pre + 1);
    }
  }, [account, count, getAccount, session?.access_token]);

  return <>{children}</>;
};

export default Security;
