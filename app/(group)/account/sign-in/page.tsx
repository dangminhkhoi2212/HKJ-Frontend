"use client";
import React from "react";
import { Button, Form } from "antd";
import { cn } from "@/utils/cn";
import { ArrowRight } from "lucide-react";
import { routes } from "@/routes";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema, LOGIN_MAX_LENGTH } from "@/validations/auth";
import InputCustom from "@/shared/InputCustom";
import useSignInActions from "./actions";
type TSignIn = {
  username: string;
  password: string;
};
const SignInPage: React.FC<{ className?: string }> = ({ className }) => {
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TSignIn>({ resolver: yupResolver(signInSchema) });

  const signInActions = useSignInActions();
  return (
    <div className="">
      <h1 className="text-2xl font-bold my-2">Đăng nhập</h1>
      <Form
        onFinish={handleSubmit(signInActions.onSubmit)}
        layout="vertical"
        className={cn(className, "flex gap-1 flex-col")}
      >
        <InputCustom
          name="username"
          showCount={true}
          label="Tên đăng nhập"
          control={control}
          allowClear
          errorMessage={errors.username?.message}
          placeholder="Tên đăng nhập"
          count={{
            max: LOGIN_MAX_LENGTH,
            show: true,
          }}
        />
        <InputCustom
          name="password"
          type="password"
          label="Mật khẩu"
          control={control}
          allowClear
          errorMessage={errors.password?.message}
          placeholder="Mật khẩu"
        />
        <div className="flex justify-center flex-col gap-2 mt-2">
          <button className="text-accent" type="button">
            Quên mật khẩu
          </button>
          <Button
            size="large"
            block
            className="!bg-primary !font-semibold"
            htmlType="submit"
            loading={signInActions.isLoading}
          >
            Đăng nhập
          </Button>
        </div>
        <div className="flex  justify-center items-center gap-4 mt-6">
          <span className="">Chưa có tài khoản?</span>
          <Button
            icon={<ArrowRight size={18} />}
            iconPosition="end"
            className="!bg-secondary-900 
          !font-medium m-0"
          >
            Đăng ký ngay
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SignInPage;
