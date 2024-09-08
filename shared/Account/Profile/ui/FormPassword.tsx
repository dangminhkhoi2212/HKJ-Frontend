"use client";
import InputCustom from "@/shared/InputCustom";
import { Button, Form } from "antd";
import React from "react";
import { useForm } from "react-hook-form";
import TitleCustom from "./TitleCustom";
import { TFormPassword } from "@/types/account.type";

const FormPassword: React.FC = () => {
  const { control, handleSubmit } = useForm<TFormPassword>({});
  return (
    <Form className="px-10" layout="vertical">
      <div>
        <div className="flex justify-between">
          <TitleCustom title="Mật khẩu cá nhân" />
          <Button type="primary" className="text-lg font-semibold">
            Cập nhật
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <InputCustom control={control} label="Mật khẩu" name="password" />
          <InputCustom
            control={control}
            label="Xác nhán mật khẩu"
            name="confirmPassword"
          />
        </div>
      </div>
    </Form>
  );
};

export default FormPassword;
