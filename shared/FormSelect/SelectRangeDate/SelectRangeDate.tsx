import { DatePicker, Space } from "antd";
import { RangePickerProps as AntRangePickerProps } from "antd/es/date-picker";
import React from "react";

import { KEY_CONST } from "@/const";
import { LabelCustom } from "@/shared/FormCustom/InputCustom";

type Props = {
	label?: string;
	labelRequired?: boolean;
} & AntRangePickerProps;

const { RangePicker } = DatePicker;

// Ensure the function returns exactly two elements in the tuple

const SelectRangeDate: React.FC<Props> = ({
	label,
	labelRequired,
	...props
}) => {
	// Handler for RangePicker's onChange event

	return (
		<Space direction="vertical">
			{label && <LabelCustom label={label} required={labelRequired} />}
			<RangePicker
				format={KEY_CONST.DATE_FORMAT}
				placeholder={["Bắt đầu", "Kết thúc"]}
				{...props}
			/>
		</Space>
	);
};

export default SelectRangeDate;
