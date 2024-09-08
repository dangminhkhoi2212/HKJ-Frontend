"use client";
import InputCustom from "@/shared/InputCustom";
import { Button, Form } from "antd";
import React from "react";
import { useForm } from "react-hook-form";
import TitleCustom from "./TitleCustom";
import { TFormEmail } from "@/types/account.type";

const FormEmail: React.FC = () => {
  const { control, handleSubmit } = useForm<TFormEmail>({});
  return (
    <Form layout="vertical" className="px-10">
      <div>
        <div className="flex justify-between">
          <TitleCustom
            title="Địa chỉ email"
            subTitle="Sử dụng địa chỉ email để nhận thông báo"
          />
          <Button type="primary" className="text-lg font-semibold">
            Cập nhật
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputCustom control={control} label="Email" name="email" />
        </div>
      </div>
    </Form>
  );
};

export default FormEmail;
