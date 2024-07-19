"use client";
import React, { useState } from "react";

import { Layout, ConfigProvider } from "antd";
import Sidebar from "../sidebar";
import Content from "../content";
import { cn } from "@/utils/cn";
import colors from "@/config/colors";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ConfigProvider
      button={{ className: "!bg-accent" }}
      theme={{
        token: {
          // Seed Token
          colorPrimary: colors.accent,
        },
      }}
    >
      <Layout className={cn("h-screen ")}>
        <Sidebar collapsed={collapsed} />
        <Content collapsed={collapsed} setCollapsed={setCollapsed}>
          {children}
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default MainLayout;
