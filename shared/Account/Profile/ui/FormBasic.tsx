"use client";
import InputCustom from "@/shared/InputCustom";
import useAccountStore from "@/stores/account";
import { TFormBasic } from "@/types/account.type";
import { formBasicSchema } from "@/validations/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Form, Typography, Spin, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import profileActions from "../actions";

const initialValues: TFormBasic = {
  id: "",
  firstName: "",
  lastName: "",
  phone: "",
};
const FormBasic: React.FC = () => {
  const [form] = Form.useForm();
  const account = useAccountStore((state) => state.account);
  const [basic, setBasic] = useState<TFormBasic>(initialValues);
  const [isLoading, setIsLoading] = useState(true);
  const {
    control,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm<TFormBasic>({
    defaultValues: initialValues,
    resolver: yupResolver(formBasicSchema),
  });
  const { formBasicActions, isLoadingFormBasic } = profileActions();
  console.log(errors);

  useEffect(() => {
    if (account) {
      reset({
        id: account.id || "",
        firstName: account.firstName || "",
        lastName: account.lastName || "",
        phone: account.phone || "",
      });
      setBasic({
        id: account.id || "",
        firstName: account.firstName || "",
        lastName: account.lastName || "",
        phone: account.phone || "",
      });
      setIsLoading(false);
    }
  }, [account, reset]);

  if (isLoading) {
    return <Skeleton active />;
  }

  return (
    <Form
      layout="vertical"
      className="px-10"
      initialValues={basic}
      form={form}
      onFinish={handleSubmit(formBasicActions)}
    >
      <div>
        <div className="flex justify-between">
          <Typography.Title level={4}>Thông tin chung</Typography.Title>
          <Button
            type="primary"
            htmlType="submit"
            className="text-lg font-semibold"
            loading={isLoadingFormBasic}
          >
            Cập nhật
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputCustom
            control={control}
            label="Họ"
            name="firstName"
            placeholder="Họ"
            errorMessage={errors.firstName?.message}
          />
          <InputCustom
            control={control}
            label="Tên"
            name="lastName"
            placeholder="Tên"
            errorMessage={errors.lastName?.message}
          />
        </div>
        <InputCustom
          control={control}
          label="Số điện thoại"
          placeholder="Số điện thoại"
          name="phone"
          errorMessage={errors.phone?.message}
          showCount
        />
      </div>
    </Form>
  );
};

export default FormBasic;
