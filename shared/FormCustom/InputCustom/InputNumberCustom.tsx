"use client";
import { Form, Input, Space } from 'antd';
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

import { cn } from '@/utils';

import NumberToWords from '../InputNumToWords/InputNumToWords';
import { LabelCustom } from './LabelCustom';

const MIN: number = 0;
const MAX: number = 100000000;
type InputNumberCustomProps = {
	name: string;
	label?: string;
	control: Control<any>;
	defaultValue?: number;
	errorMessage?: string;
	suffix?: string;
	extra?: React.ReactNode;
	toWords?: boolean;
} & NumericFormatProps;

const InputNumberCustom = React.forwardRef<
	HTMLInputElement,
	InputNumberCustomProps
>(
	(
		{
			name,
			label,
			control,
			defaultValue,
			errorMessage,
			suffix = " VND",
			extra,
			toWords = false,
			...props
		},
		ref
	) => {
		return (
			<Controller
				name={name}
				control={control}
				defaultValue={defaultValue}
				render={({ field, fieldState }) => (
					<Form.Item
						label={
							label && (
								<LabelCustom label={label} required={true} />
							)
						}
						validateStatus={fieldState.invalid ? "error" : ""}
						help={errorMessage || fieldState.error?.message}
						extra={extra}
						rootClassName="m-0"
					>
						<Space direction="vertical">
							<NumericFormat
								{...props}
								placeholder={props.placeholder ?? label}
								size="large"
								thousandSeparator=","
								min={props.min || MIN}
								max={props.max || MAX}
								className={cn("text-right ", props.className)}
								suffix={suffix}
								customInput={Input}
								value={field.value}
								onValueChange={(values, source) => {
									field.onChange(values.value);
									if (props.onValueChange) {
										props.onValueChange(values, source);
									}
								}}
							/>
							{toWords && field.value !== 0 && (
								<NumberToWords number={field.value} />
							)}
						</Space>
					</Form.Item>
				)}
			/>
		);
	}
);

InputNumberCustom.displayName = "InputNumberCustom";

export default InputNumberCustom;
