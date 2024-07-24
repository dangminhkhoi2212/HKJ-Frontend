import React from "react";
import { Layout } from "antd";
import AppHeader from "@/shares/Content/Header";
import useStyleStore from "@/stores/stype";

const { Content } = Layout;

const AppContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colorBgContainer, borderRadiusLG } = useStyleStore((state) => state);
  return (
    <Layout>
      <AppHeader />
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
