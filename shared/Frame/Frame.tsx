"use client";
import { Typography } from "antd";
import React from "react";

import { cn } from "@/utils/cn";

const Frame: React.FC<{
  title: string;
  discription?: React.ReactNode;
  classsName?: string;
  children?: React.ReactNode;
  buttons?: React.ReactNode;
}> = ({ title, discription, classsName, buttons, children }) => {
  const { Title } = Typography;
  return (
    <div className=" border  rounded-md flex flex-col  gap-4 overflow-hidden">
      <div className=" p-5  bg-primary-950 flex justify-between items-center">
        <div className="flex flex-col justify-start">
          <Title level={4} className="">
            {title}
          </Title>
          {discription}
        </div>
        {buttons && <div>{buttons}</div>}
      </div>
      <div className={cn("p-5", classsName)}>{children}</div>
    </div>
  );
};

export default Frame;
