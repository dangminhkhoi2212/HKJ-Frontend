import { Form, Input } from "antd";
import { TextAreaProps } from "antd/es/input";
import React from "react";
import { Control, Controller } from "react-hook-form";

import { LabelCustom } from "./LabelCustom";

import type { InputProps } from "antd/lib/input";
type InputCustomProps = {
  name: string;
  label?: string;
  required?: boolean;
  allowClear?: InputProps["allowClear"];
  showCount?: InputProps["showCount"];
  placeholder?: string;
  control: Control<any>;
  errorMessage?: string;
  tooltip?: string;
  type?: "text" | "password" | "textarea" | "number" | "price";
  extra?: React.ReactNode;
  formItemClassName?: string;
} & InputProps;

const InputCustom: React.FC<InputCustomProps> = ({
  name,
  label,
  required = true,
  control,
  errorMessage,
  extra,
  formItemClassName,
  ...props
}) => {
  const { Password, TextArea } = Input;
  // Filter out unsupported props for TextArea
  const getTextAreaProps = (): TextAreaProps => {
    const { prefix, suffix, addonBefore, addonAfter, ...textAreaProps } = props;
    return textAreaProps as TextAreaProps; // Return only applicable props for TextArea
  };
  const renderInput = (field: any) => {
    switch (props.type) {
      case "number":
        return <Input {...field} {...props} size="large" type="number" />;
      case "password":
        return <Password {...field} {...props} size="large" />;
      case "textarea":
        return (
          <TextArea
            {...field}
            {...getTextAreaProps()}
            rows={4}
            maxLength={200}
          />
        );

      default:
        return <Input {...field} {...props} size="large" type="text" />;
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: required }}
      render={({ field, fieldState }) => (
        <Form.Item
          label={<LabelCustom label={label} required={required} />}
          validateStatus={fieldState.invalid ? "error" : ""}
          help={fieldState.invalid ? errorMessage : null}
          className={formItemClassName}
          extra={extra}
        >
          {renderInput(field)}
        </Form.Item>
      )}
    />
  );
};

export default InputCustom;
