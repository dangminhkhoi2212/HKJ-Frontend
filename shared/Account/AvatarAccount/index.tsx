"use client";
import useAccountStore, { TAccountInfo } from "@/stores/account";
import React from "react";
import { Avatar } from "antd";

const AvatarAccount: React.FC = () => {
  const account: TAccountInfo | null = useAccountStore(
    (state) => state.account
  );
  return (
    <Avatar className="align-middle bg-accent-700 font-medium" size="large">
      {account?.lastName || "User"}
    </Avatar>
  );
};

export default AvatarAccount;
