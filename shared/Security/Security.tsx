"use client";
import { App } from "antd";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

import Loading from "@/app/loading";
import { useAccount } from "@/hooks/account";
import { routes } from "@/routes";
import useAccountStore from "@/stores/account";
import { TAccountInfo } from "@/types";

import LoadingIntro from "../Loading/LoadingIntro";

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

  useEffect(() => {
    if (count > 4) return;
    if (!account && session?.access_token && pathname !== routes.signIn) {
      getAccount.refetch();
      setCount((pre) => pre + 1);
    }
  }, [account, count, getAccount, session?.access_token]);
  if (!account && pathname !== routes.signIn) {
    return <LoadingIntro />;
  }
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
};

export default Security;
