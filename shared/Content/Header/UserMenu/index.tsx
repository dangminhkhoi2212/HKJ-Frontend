"use client";
import useAccountStore, { TAccountInfo } from "@/stores/account";
import React, { useEffect, useState } from "react";
import AccountButton from "./AccountButton";
import SignInButton from "./SignInButton";
import { useSession } from "next-auth/react";

const UserMenu = () => {
  const account: TAccountInfo | null = useAccountStore(
    (state) => state.account
  );
  const { data: session } = useSession();
  const [isAuthorized, setIsAuthorized] = useState(() => {
    return !!session;
  });
  useEffect(() => {
    setIsAuthorized(!!session);
  }, [session]);
  return <>{isAuthorized ? <AccountButton /> : <SignInButton />}</>;
};

export default UserMenu;
