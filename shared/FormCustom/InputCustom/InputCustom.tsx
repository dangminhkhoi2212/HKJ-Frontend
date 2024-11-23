"use client";
import { DatePicker, Form, Input, Select } from "antd";
import { TextAreaProps } from "antd/es/input";
import { SelectProps } from "antd/lib";
import dayjs, { Dayjs } from "dayjs";
import dynamic from "next/dynamic";
import React from "react";
import { Control, Controller } from "react-hook-form";

import { KEY_CONST } from "@/const";

import { LabelCustom } from "./LabelCustom";

import type { InputProps } from "antd/lib/input";
const ReactQuill = dynamic(() => import("react-quill-new"), {
	ssr: false,
});
const { RangePicker } = DatePicker;
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
	type?:
		| "text"
		| "password"
		| "textarea"
		| "number"
		| "rangeDate"
		| "date"
		| "select"
		| "description";
	extra?: React.ReactNode;
	formItemClassName?: string;
	minDate?: Dayjs;
	maxDate?: Dayjs;
} & InputProps &
	TextAreaProps &
	SelectProps;

const InputCustom: React.FC<InputCustomProps> = ({
	name,
	label,
	required = true,
	control,
	errorMessage,
	extra,
	formItemClassName,
	minDate,
	maxDate,
	...props
}) => {
	const { Password, TextArea } = Input;
	// Filter out unsupported props for TextArea
	const getTextAreaProps = (): TextAreaProps => {
		const { prefix, suffix, addonBefore, addonAfter, ...textAreaProps } =
			props;
		return textAreaProps as TextAreaProps; // Return only applicable props for TextArea
	};

	const renderInput = (field: any, fieldState: any) => {
		switch (props.type) {
			case "number":
				return (
					<Input size="large" {...field} {...props} type="number" />
				);
			case "password":
				return <Password size="large" {...field} {...props} />;
			case "textarea":
				return (
					<TextArea maxLength={200} rows={4} {...field} {...props} />
				);
			case "rangeDate":
				return (
					<RangePicker
						allowClear={false}
						value={
							field.value
								? [
										dayjs(field.value.startDate),
										dayjs(field.value.endDate),
									]
								: undefined
						} // Handle value
						onChange={(dates) => {
							if (dates)
								field.onChange({
									startDate: dates![0]?.hour(0),
									endDate: dates![1]?.hour(23),
								});
						}}
						size="large"
						className="w-80"
						placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
						format={KEY_CONST.DATE_FORMAT}
						minDate={minDate!}
						maxDate={maxDate!}
					/>
				);
			case "date":
				return (
					<DatePicker
						// {...props}
						value={field.value && dayjs(field.value)}
						onChange={(value) => {
							field.onChange(value?.toISOString());
						}}
						size="large"
						className="w-40"
						format={KEY_CONST.DATE_FORMAT}
						minDate={minDate!}
						maxDate={maxDate!}
					/>
				);
			case "select":
				return (
					<Select
						size="large"
						{...field}
						{...props}
						options={props.options}
						onChange={(value) => {
							field.onChange(value);
						}}
					/>
				);
			case "description":
				return (
					<ReactQuill value={field.value} onChange={field.onChange} />
				);
			default:
				return (
					<Input
						size="large"
						type="text"
						{...field}
						{...props}
						onChange={(value) => {
							field.onChange(value);
						}}
					/>
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
							<LabelCustom label={label} required={required} />
						)
					}
					validateStatus={fieldState.invalid ? "error" : ""}
					help={
						fieldState.invalid
							? errorMessage || fieldState.error?.message
							: null
					}
					className={formItemClassName}
					extra={extra}
					rootClassName="m-0 p-0"
				>
					{renderInput(field, fieldState)}
				</Form.Item>
			)}
		/>
	);
};

export default InputCustom;
