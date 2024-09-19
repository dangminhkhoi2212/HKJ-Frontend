"use client";
import Frame from "@/shared/Frame";
import React from "react";
import HireEmployeeForm from "./ui/HireEmployeeForm";

const HirePage: React.FC = () => {
  return (
    <Frame title="Thuê nhân viên">
      <HireEmployeeForm />
    </Frame>
  );
};

export default HirePage;
