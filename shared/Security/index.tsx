"use client";
import { useAccount } from "@/hooks/account";
import useAccountStore, { TAccountInfo } from "@/stores/account";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import useAccountButtonActions from "../Content/Header/UserMenu/AccountButton/actions";
const Security: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const account: TAccountInfo | null | undefined = useAccountStore(
    (state) => state.account
  );
  const { signOutAll } = useAccountButtonActions();
  const { refetch: getAccount } = useAccount();
  const { data: session } = useSession();
  if (session?.error == "RefreshAccessTokenError") {
    signOut({ callbackUrl: "/" });
  }
  console.log("🚀 ~ session:", session);
  useEffect(() => {
    try {
      if (!account && session) getAccount();
    } catch (error) {
      signOutAll();
    }
  }, [account, getAccount, pathname, session, signOutAll]);

  return <>{children}</>;
};

export default Security;
