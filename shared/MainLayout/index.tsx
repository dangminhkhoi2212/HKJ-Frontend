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
  return (
    <Layout className={cn("h-screen ")}>
      <Sidebar />
      <AppContent>{children}</AppContent>
    </Layout>
  );
};

export default MainLayout;
