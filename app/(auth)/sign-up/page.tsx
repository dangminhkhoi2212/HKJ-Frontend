"use client";
import routes from "@/routes";
import InputCustom from "@/shares/InputCustom";
import {
  EMAIL_MAX_LENGTH,
  FIRSTNAME_MAX_LENGTH,
  LASTNAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PHONE_LENGTH,
  USERNAME_MAX_LENGTH,
} from "@/validations/auth";
import { Button, Form, Input, Typography } from "antd";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
type Inputs = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  phone: string;
};
const SignUpPage = () => {
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);
  return (
    <div className="">
      <div className="flex justify-start items-center gap-4 mt-6">
        <Button
          icon={<ArrowLeft size={18} />}
          iconPosition="start"
          className="!bg-secondary-900 
    !font-medium"
          onClick={() => router.push(routes.signIn)}
        >
          Đăng nhập ngay
        </Button>
      </div>
      <h1 className="text-2xl font-bold my-2">Đăng ký</h1>
      <Form
        onFinish={handleSubmit(onSubmit)}
        layout="vertical"
        className="flex gap-1 flex-col"
      >
        <div className="flex gap-3">
          <InputCustom
            name="firstName"
            showCount={true}
            label="Họ"
            control={control}
            allowClear
            errorMessage={errors.firstName?.message}
            placeholder="Họ"
            count={{
              show: true,
              max: FIRSTNAME_MAX_LENGTH,
            }}
          />
          <InputCustom
            name="lastName"
            showCount={true}
            label="Tên"
            control={control}
            allowClear
            errorMessage={errors.lastName?.message}
            placeholder="Tên"
            count={{
              show: true,
              max: LASTNAME_MAX_LENGTH,
            }}
          />
        </div>
        <InputCustom
          name="username"
          showCount={true}
          label="Tên đăng nhập"
          control={control}
          allowClear
          errorMessage={errors.username?.message}
          placeholder="Tên đăng nhập"
          count={{
            show: true,
            max: USERNAME_MAX_LENGTH,
          }}
        />
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
        <InputCustom
          name="phone"
          showCount={true}
          label="Số điện thoại"
          control={control}
          allowClear
          errorMessage={errors.phone?.message}
          placeholder="Số điện thoại"
          count={{
            show: true,
            max: PHONE_LENGTH,
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
        <InputCustom
          name="passwordConfirmation"
          label="Nhập lại mật khẩu"
          type="password"
          control={control}
          allowClear
          errorMessage={errors.passwordConfirmation?.message}
          placeholder="Nhập lại mật khẩu"
        />

        <Button
          size="large"
          block
          className="!bg-primary !font-semibold"
          htmlType="submit"
        >
          Đăng ký
        </Button>
      </Form>
    </div>
  );
};

export default SignUpPage;
