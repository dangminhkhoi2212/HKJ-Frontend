import { Form, Input } from "antd";
import { TextAreaProps } from "antd/es/input";
import React from "react";
import { Control, Controller } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

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
} & InputProps &
  TextAreaProps;

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
  console.log(
    "🚀 InputCustom~ ",

    errorMessage,
    name
  );
  const inputId = uuidv4();
  const renderInput = (field: any) => {
    switch (props.type) {
      case "number":
        return (
          <Input
            size="large"
            {...field}
            {...props}
            type="number"
            id={inputId}
          />
        );
      case "password":
        return <Password size="large" {...field} {...props} id={inputId} />;
      case "textarea":
        return (
          <TextArea
            maxLength={200}
            rows={4}
            {...field}
            {...props}
            id={inputId}
          />
        );

      default:
        return (
          <Input size="large" {...field} {...props} type="text" id={inputId} />
        );
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: required }}
      render={({ field, fieldState }) => (
        <Form.Item
          label={
            label && (
              <LabelCustom label={label} required={required} id={inputId} />
            )
          }
          validateStatus={fieldState.invalid ? "error" : ""}
          help={fieldState.invalid ? errorMessage : null}
          className={formItemClassName}
          extra={extra}
          rootClassName="m-0 p-0"
        >
          {renderInput(field)}
        </Form.Item>
      )}
    />
  );
};

export default InputCustom;
