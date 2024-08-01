import InputCustom from "@/shared/InputCustom";
import { TResetPasswordForm } from "@/types/account.type";
import { changePasswordSchema } from "@/validations/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Form, Space } from "antd";
import React from "react";
import { useForm } from "react-hook-form";

const ChangePasswordForm: React.FC<{
  label1: string;
  label2: string;
  onSubmit: (data: TResetPasswordForm) => void;
}> = ({ label1, label2, onSubmit }) => {
  const [form] = Form.useForm();
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<TResetPasswordForm>({
    resolver: yupResolver(changePasswordSchema),
  });

  const onSubmitForm = (data: TResetPasswordForm) => {
    onSubmit(data);
    form.resetFields();
  };
  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit(onSubmitForm)}>
      <InputCustom
        control={control}
        label={label1}
        placeholder={label1}
        name="password"
        type="password"
        errorMessage={errors.password?.message}
      />
      <InputCustom
        control={control}
        label={label2}
        placeholder={label2}
        type="password"
        name="confirmPassword"
        errorMessage={errors.confirmPassword?.message}
      />
      <div className="flex justify-end">
        <Button htmlType="submit" type="primary">
          Thay đổi
        </Button>
      </div>
    </Form>
  );
};

export default ChangePasswordForm;
