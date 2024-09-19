import useStypeStore from "@/stores/stype";
import { cn } from "@/utils/cn";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, theme } from "antd";
import React from "react";
import RoleTag from "./RoleTag";
import SearchHeader from "./SearchHeader";
import UserMenu from "./UserMenu";
const { Header } = Layout;
const AppHeader: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { collapsed } = useStypeStore((state) => state);
  const toggleCollapsed = useStypeStore((state) => state.toggleCollapsed);

  return (
    <Header
      style={{ background: colorBgContainer }}
      className={cn("flex items-center justify-between px-5")}
    >
      <Button
        type="text"
        icon={
          collapsed ? (
            <MenuUnfoldOutlined className="" />
          ) : (
            <MenuFoldOutlined className="" />
          )
        }
        onClick={() => toggleCollapsed()}
        style={{
          fontSize: "16px",
          width: 32,
          height: 32,
        }}
      />
      <SearchHeader />
      <div className="flex justify-center items-center gap-4">
        <RoleTag />
        <UserMenu />
      </div>
    </Header>
  );
};

export default AppHeader;
