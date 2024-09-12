"use client";
import { useAccount } from "@/hooks/account";
import { routesUser } from "@/routes";
import useAccountStore, { TAccountInfo } from "@/stores/account";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { AUTHORIZATIONS } from "@/const/authorities";
const Security: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const account: TAccountInfo | null | undefined = useAccountStore(
    (state) => state.account
  );
  const { refetch: getAccount } = useAccount();
  const { data: session } = useSession();
  if (session?.error == "RefreshAccessTokenError") {
    signOut({ callbackUrl: "/" });
  }
  console.log("🚀 ~ session:", session);
  useEffect(() => {
    if (!account && session) getAccount();
  }, [account, getAccount, pathname, session]);

  return <>{children}</>;
};

export default Security;
