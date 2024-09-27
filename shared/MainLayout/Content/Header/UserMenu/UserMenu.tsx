"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { AccountButton } from "./AccountButton";
import { SignInButton } from "./SignInButton";

type Props = {};
const UserMenu: React.FC<Props> = () => {
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
