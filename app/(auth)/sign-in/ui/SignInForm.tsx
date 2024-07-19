"use client";
import React from "react";
import { Button, Flex, Input, Typography } from "antd";
import { cn } from "@/utils/cn";
const SignInForm: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <form className={cn(className, "flex gap-5 flex-col")}>
      <div>
        <Typography.Title level={5}>Tên đăng nhập</Typography.Title>
        <Input
          allowClear
          count={{
            show: true,
            max: 30,
          }}
          size="large"
          placeholder="Tên đăng nhập"
        />
      </div>
      <div>
        <Typography.Title level={5}>Mật khẩu</Typography.Title>
        <Input.Password
          count={{
            show: false,
            max: 30,
          }}
          size="large"
          placeholder="Mật khẩu"
        />
      </div>
      <button className="text-accent">Quên mật khẩu</button>
      <Button size="large" block>
        Đăng nhập
      </Button>
    </form>
  );
};

export default SignInForm;
