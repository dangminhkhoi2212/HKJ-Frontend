import { Form, Input, Typography } from "antd";
import React from "react";
import { Control, Controller } from "react-hook-form";
import type { InputProps } from "antd/lib/input";
type InputCustomProps = {
  name: string;
  label: string;
  type?: string;
  isRule?: boolean;
  allowClear?: InputProps["allowClear"];
  showCount?: InputProps["showCount"];
  placeholder?: string;
  control: Control<any>;
  errorMessage?: string;
} & InputProps;
const InputCustom: React.FC<InputCustomProps> = ({
  name,
  label,
  isRule = true,
  placeholder,
  control,
  errorMessage,
  type = "text",
  ...props
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: isRule }}
      render={({ field, fieldState }) => (
        <Form.Item
          name={name}
          label={
            <Typography.Title level={5} className="m-0">
              {label}
            </Typography.Title>
          }
          rules={[
            {
              required: isRule,
            },
          ]}
          help={<span className="text-red-400">{errorMessage}</span>}
        >
          {type === "password" ? (
            <Input.Password
              type={type}
              {...field}
              size="large"
              placeholder={placeholder}
              {...props}
            />
          ) : (
            <Input
              type={type}
              {...field}
              size="large"
              placeholder={placeholder}
              {...props}
            />
          )}
        </Form.Item>
      )}
    />
  );
};

export default InputCustom;
