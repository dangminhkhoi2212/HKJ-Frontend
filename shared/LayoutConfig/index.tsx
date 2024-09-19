"use client";
import React from "react";
import { App as AppAntd, ConfigProvider, theme } from "antd";

import themeConfig from "@/config/theme";

const LayoutConfig = ({ children }: React.PropsWithChildren) => {
  return (
    <ConfigProvider theme={themeConfig}>
      <AppAntd>{children}</AppAntd>
    </ConfigProvider>
  );
};

export default LayoutConfig;
