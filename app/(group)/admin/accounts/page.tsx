"use client";
import Frame from "@/shared/Frame";
import Link from "next/link";
import React from "react";

const AccountPage: React.FC = () => {
  return (
    <Frame title="Quản lí tài khoản">
      <p>Sử dụng KeyCloak quản lí người dùng và phân quyền. </p>
      <Link
        target="_blank"
        href={process.env.NEXT_PUBLIC_KEYCLOAK_ADMIN || "/error"}
      >
        Mở KeyCloak
      </Link>
    </Frame>
  );
};

export default AccountPage;
