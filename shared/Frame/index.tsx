"use client";
import { cn } from "@/utils/cn";
import { Typography } from "antd";
import React from "react";

const Frame: React.FC<{
  id: string;
  title: string;
  discription?: React.ReactNode;
  classsName?: string;
  children: React.ReactNode;
}> = ({ id, title, discription, classsName, children }) => {
  const { Title } = Typography;
  return (
    <div
      id={id}
      className=" border  rounded-md flex flex-col gap-4 overflow-hidden"
    >
      <div className="bg-primary-950 p-5 flex flex-col justify-start">
        <Title level={4} className="">
          {title}
        </Title>
        {discription}
      </div>
      <div className={cn("p-5", classsName)}>{children}</div>
    </div>
  );
};

export default Frame;
