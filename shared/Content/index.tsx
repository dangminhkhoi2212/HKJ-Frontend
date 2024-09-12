import React from "react";
import { Layout, theme } from "antd";
import AppHeader from "@/shared/Content/Header";

const { Content } = Layout;
const AppContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout className="min-h-screen">
      <AppHeader />
      <Content
        style={{
          margin: "24px 16px",
          padding: 24,
          minHeight: 280,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
        className="overflow-auto"
      >
        {children}
      </Content>
    </Layout>
  );
};

export default AppContent;
