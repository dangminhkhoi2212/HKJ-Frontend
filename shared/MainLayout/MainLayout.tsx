"use client";
import { Layout } from "antd";
import React from "react";

import { cn } from "@/utils/cn";

import { AppContent } from "./Content";
import { Sidebar } from "./Sidebar";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Layout className={cn("min-h-screen")} hasSider>
      <Sidebar />
      <AppContent>{children}</AppContent>
    </Layout>
  );
};

export default MainLayout;
