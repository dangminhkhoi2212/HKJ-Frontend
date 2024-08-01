"use client";
import useAccountStore, { TAccountInfo } from "@/stores/account";
import React from "react";
import AccountButton from "./AccountButton";

const UserMenu = () => {
  const account: TAccountInfo | null = useAccountStore(
    (state) => state.account
  );
  return (
    <>
      <AccountButton />
    </>
  );
};

export default UserMenu;
