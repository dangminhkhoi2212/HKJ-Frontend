"use client";

import { Button, Form, Input, Typography } from "antd";
import { ArrowLeft } from "lucide-react";
import routes from "@/routes";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { resetPasswordSchema, EMAIL_MAX_LENGTH } from "@/validations/auth";
import InputCustom from "@/shared/InputCustom";
import useResetPasswordActions from "./actions";
import { TResetPassword } from "@/types/account.type";

const ResetPasswordPage = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TResetPassword>({ resolver: yupResolver(resetPasswordSchema) });
  const { onSubmit, isLoading } = useResetPasswordActions();
  return (
    <div>
      <div className="flex justify-start items-center gap-4 ">
        <Button
          icon={<ArrowLeft size={18} />}
          iconPosition="start"
          className="!bg-secondary-900 !font-medium"
          onClick={() => router.push(routes.signIn)}
        >
          Đăng nhập ngay
        </Button>
      </div>
      <Form
        form={form}
        onFinish={handleSubmit((data) => onSubmit(data, form.resetFields))}
        layout="vertical"
        className="flex gap-5 flex-col mt-5"
      >
        <InputCustom
          name="email"
          showCount={true}
          label="Email"
          control={control}
          allowClear
          errorMessage={errors.email?.message}
          placeholder="Email"
          count={{
            show: true,
            max: EMAIL_MAX_LENGTH,
          }}
        />

        <div>
          <Button
            htmlType="submit"
            className="!max-w-40 float-end !bg-primary !font-semibold "
            size="large"
            loading={isLoading}
          >
            Đặt lại mật khẩu
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ResetPasswordPage;
