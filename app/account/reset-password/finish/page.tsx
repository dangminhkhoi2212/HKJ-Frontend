"use client";
import ChangePasswordForm from "@/shared/Account/ChangePasswordForm";
import { Typography } from "antd";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import useResetPasswordActions from "../actions";
import useResetPasswordFinish from "./actions";

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const { onSubmit } = useResetPasswordFinish();
  const [key, setKey] = useState<string | null>();
  useEffect(() => {
    setKey(searchParams.get("key"));
  }, [searchParams]);
  if (!key)
    return (
      <div className="flex justify-center items-center">
        <Typography.Title level={4} className="">
          Trang không hợp lệ
        </Typography.Title>
      </div>
    );

  return (
    <div>
      <Typography.Title level={4} className="">
        Cập nhật mật khẩu mới của bạn{" "}
      </Typography.Title>
      <ChangePasswordForm
        label1="Mật khẩu mới"
        label2="Xác nhận mật khẩu mới"
        onSubmit={(data) => onSubmit(data, key)}
      />
    </div>
  );
};

export default ResetPasswordPage;
