import React from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, theme } from "antd";
import { cn } from "@/utils/cn";
import SearchHeader from "./SearchHeader";
import useStypeStore from "@/stores/stype";
const { Header } = Layout;

const AppHeader: React.FC = () => {
  const { collapsed, colorBgContainer } = useStypeStore((state) => state);
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
            <MenuUnfoldOutlined className="text-white" />
          ) : (
            <MenuFoldOutlined className="text-white" />
          )
        }
        onClick={() => toggleCollapsed()}
        style={{
          fontSize: "16px",
          width: 32,
          height: 32,
        }}
      />
      {/* <SearchHeader /> */}
    </Header>
  );
};

export default AppHeader;