import { Form, Input } from "antd";
import React from "react";
import { Control, Controller } from "react-hook-form";
import { NumericFormat, NumericFormatProps } from "react-number-format";

import { cn } from "@/utils";

import { LabelCustom } from "./LabelCustom";

const MIN: number = 0;
const MAX: number = 100000000;
type InputNumberCustomProps = {
  name: string;
  label: string;
  control: Control<any>;
  defaultValue?: number;
  errorMessage?: string;
  suffix?: string;
} & NumericFormatProps;

const InputNumberCustom = React.forwardRef<
  HTMLInputElement,
  InputNumberCustomProps
>(
  (
    { name, label, control, defaultValue, errorMessage, suffix, ...props },
    ref
  ) => {
    return (
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field, fieldState }) => (
          <Form.Item
            label={<LabelCustom label={label} required={true} />}
            validateStatus={fieldState.invalid ? "error" : ""}
            help={errorMessage}
          >
            <NumericFormat
              {...props}
              size="large"
              thousandSeparator=","
              className={cn("text-right ", props.className)}
              suffix={suffix}
              customInput={Input}
              value={field.value}
              onValueChange={(values) => {
                field.onChange(values.value);
              }}
            />
          </Form.Item>
        )}
      />
    );
  }
);

InputNumberCustom.displayName = "InputNumberCustom";

export default InputNumberCustom;
