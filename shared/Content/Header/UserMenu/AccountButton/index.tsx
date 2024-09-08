"use client";
import { routesUser } from "@/routes";
import useAccountStore, { TAccountInfo } from "@/stores/account";
import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  Space,
  Spin,
  theme,
  Tooltip,
} from "antd";
import { MenuProps } from "antd/lib";
import Link from "next/link";
import React from "react";
import useAccountButtonActions from "./actions";
import AvatarAccount from "@/shared/Account/AvatarAccount";
import { LogOut } from "lucide-react";

const AccountButton: React.FC = () => {
  const account: TAccountInfo | null = useAccountStore(
    (state) => state.account
  );
  const isLoading: boolean = useAccountStore((state) => state.isLoading);
  console.log("🚀 ~ account:", account);
  const { signOutAll } = useAccountButtonActions();
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Link
          href={routesUser.profile}
          className="flex flex-col gap-2 justify-start items-center m-0"
        >
          <AvatarAccount />
          <p className="m-0">{account?.email}</p>
        </Link>
      ),
    },
  ];
  const { useToken } = theme;
  const { token } = useToken();
  const menuStyle: React.CSSProperties = {
    boxShadow: "none",
  };
  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };
  if (isLoading) {
    return <Spin />;
  }
  return (
    <>
      {account ? (
        <Dropdown
          trigger={["click"]}
          placement="bottomRight"
          arrow
          menu={{ items }}
          dropdownRender={(menu) => (
            <div style={contentStyle} className="">
              {React.cloneElement(menu as React.ReactElement, {
                style: menuStyle,
              })}
              <Divider className="m-1" />
              <div className="w-full  p-2">
                <Button
                  htmlType="button"
                  className="w-full "
                  onClick={() => signOutAll()}
                  icon={<LogOut size={18} />}
                >
                  Đăng xuất
                </Button>
              </div>
            </div>
          )}
        >
          <div>
            <Tooltip title="Tài khoản" className=" cursor-pointer ">
              <div>
                <AvatarAccount />
              </div>
            </Tooltip>
          </div>
        </Dropdown>
      ) : (
        <AvatarAccount>
          <Spin />
        </AvatarAccount>
      )}
    </>
  );
};

export default AccountButton;
