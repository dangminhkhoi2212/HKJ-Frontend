"use client";

import { Button, Form, Input, Typography } from "antd";
import { ArrowLeft } from "lucide-react";
import routes from "@/routes";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { resetPasswordSchema, EMAIL_MAX_LENGTH } from "@/validations/auth";
import InputCustom from "@/shares/InputCustom";
type Inputs = {
  email: string;
};
const ResetPassword = () => {
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>({ resolver: yupResolver(resetPasswordSchema) });
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);
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
        onFinish={handleSubmit(onSubmit)}
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
          >
            Đặt lại mật khẩu
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ResetPassword;
