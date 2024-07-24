"use client";
import React from "react";
import { StyleProvider } from "@ant-design/cssinjs";
const LayoutConfig = ({ children }: { children: React.ReactNode }) => {
  return <StyleProvider layer>{children}</StyleProvider>;
};

export default LayoutConfig;
