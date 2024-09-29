"use client";
import { Button, Tag } from "antd";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React from "react";

import { useRouterCustom } from "@/hooks";
import { AccountDisplay } from "@/shared/FormSelect/AccountForm";
import { Frame } from "@/shared/Frame";
import useAccountStore from "@/stores/account";

const Profile: React.FC = () => {
  const { router, pathname } = useRouterCustom();
  const { account } = useAccountStore();
  return (
    <div className="flex flex-col gap-4">
      <Frame
        title="Thông tin tài khoản"
        classsName="flex flex-col "
        discription={
          <p>
            Tài khoản của bạn được quản lý bởi{" "}
            <span className="font-bold">KeyCloak</span>
          </p>
        }
      >
        <p>
          Hãy cập nhật thông tin tài khoản{" "}
          <Link
            href={process.env.NEXT_PUBLIC_KEYCLOAK_ACCOUNT_DASHBOARD_URL || ""}
          >
            Tại đây
          </Link>
        </p>
      </Frame>
      <div className="flex items-center">
        <Tag color="gold">
          Nếu thông tin bạn cập nhật chưa thay đổi hay thử tải lại trang web
        </Tag>
        <Button
          type="primary"
          size="small"
          onClick={() => {
            signIn("keycloak");
          }}
        >
          Tải lại
        </Button>
      </div>
      <AccountDisplay account={account!} />
    </div>
  );
};

export default Profile;
