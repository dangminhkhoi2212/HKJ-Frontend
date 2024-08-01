"use client";
import routes from "@/routes";
import { resetPassword, resetPasswordFinish } from "@/services/account.service";
import {
  TResetPasswordForm,
  TResetPasswordFormApi,
} from "@/types/account.type";
import { App } from "antd";
import { useRouter } from "next/navigation";
import React from "react";
import { useMutation } from "react-query";

type TUseResetPasswordFinish = {
  onSubmit: (data: TResetPasswordForm, key: string) => void;
  isLoading: boolean;
};
const useResetPasswordFinish = (): TUseResetPasswordFinish => {
  const router = useRouter();
  const { message } = App.useApp();
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: TResetPasswordFormApi) => {
      return resetPasswordFinish(data);
    },
    onSuccess() {
      message.success("Thay đổi mật khẩu thành công");
      router.push(routes.signIn);
    },
    onError(error) {
      message.error("Có lỗi khi thay đổi mật khẩu");
    },
  });
  const onSubmit = (data: TResetPasswordForm, key: string) => {
    const newData = {
      key,
      newPassword: data.password,
    };
    resetPasswordMutation.mutate(newData);
  };
  return { onSubmit, isLoading: resetPasswordMutation.isLoading };
};
export default useResetPasswordFinish;
