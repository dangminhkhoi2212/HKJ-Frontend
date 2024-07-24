"use client";
import React, { useEffect } from "react";

import { Layout, ConfigProvider } from "antd";
import { theme } from "antd";

import { cn } from "@/utils/cn";
import colors from "@/config/colors";
import Sidebar from "../Sidebar";
import AppContent from "../Content";
import useStyleStore from "@/stores/stype";
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const setToken: (colorBgContainer: string, borderRadiusLG: number) => void =
    useStyleStore((state) => state.setToken);
  useEffect(() => {
    setToken(colorBgContainer, borderRadiusLG);
  }, [colorBgContainer, borderRadiusLG, setToken]);

  return (
    <ConfigProvider
      button={{ className: "!bg-accent" }}
      theme={{
        token: {
          // Seed Token
          colorPrimary: colors.accent.DEFAULT,
          colorText: colors.text,
        },
      }}
    >
      <Layout className={cn("h-screen ")}>
        <Sidebar />
        <AppContent>{children}</AppContent>
      </Layout>
    </ConfigProvider>
  );
};

export default MainLayout;
