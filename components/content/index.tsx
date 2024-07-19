"use client";
import React from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, theme } from "antd";
import { SearchProps } from "antd/es/input";
import { Input, Space } from "antd";
import { cn } from "@/utils/cn";
import SearchText from "./search-text";
import SearchImage from "./search-image";
const { Search } = Input;

const { Header, Content } = Layout;

const AppContent: React.FC<{
  children: React.ReactNode;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ children, collapsed, setCollapsed }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Header
        style={{ background: colorBgContainer }}
        className={cn("flex items-center justify-between px-5")}
      >
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: "16px",
            width: 32,
            height: 32,
          }}
        />
        <SearchImage />
        <SearchText />
      </Header>
      <Content
        style={{
          margin: "24px 16px",
          padding: 24,
          minHeight: 280,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        {children}
      </Content>
    </Layout>
  );
};

export default AppContent;
