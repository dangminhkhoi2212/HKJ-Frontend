"use client";
import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { App as AppAntd, ConfigProvider, theme } from "antd";
import useStyleStore from "@/stores/stype";
import {
  StyleProvider,
  legacyLogicalPropertiesTransformer,
} from "@ant-design/cssinjs";
import themeConfig from "@/config/theme";

const queryClient = new QueryClient();

const LayoutConfig = ({ children }: React.PropsWithChildren) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const setToken = useStyleStore((state) => state.setToken);

  useEffect(() => {
    setToken(colorBgContainer, borderRadiusLG);
  }, [colorBgContainer, borderRadiusLG, setToken]);

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={themeConfig}>
        <AppAntd>{children}</AppAntd>
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default LayoutConfig;
