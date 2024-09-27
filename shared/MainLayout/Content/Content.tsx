import { Layout, theme } from "antd";
import React from "react";

import { AppHeader } from "./Header";

const { Content } = Layout;
const AppContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout className="max-h-screen">
      <AppHeader />
      <Content
        style={{
          margin: "16px",
          minHeight: 280,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
        className="overflow-auto p-5"
      >
        {children}
      </Content>
    </Layout>
  );
};

export default AppContent;
