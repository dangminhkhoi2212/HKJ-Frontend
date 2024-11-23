"use client";
import { DatePicker, Space } from "antd";
import dayjs, { Dayjs } from "dayjs";
import React, { Dispatch, SetStateAction } from "react";

import { KEY_CONST } from "@/const";
import { LabelCustom } from "@/shared/FormCustom/InputCustom";

import { TStatisticQuery } from "./StatisticDashBoard";

type Props = {
	setQuery: Dispatch<SetStateAction<TStatisticQuery>>;
	query: TStatisticQuery;
};

const FilterStatistic: React.FC<Props> = ({ query, setQuery }) => {
	// Handle date changes
	const handleDateChange = (date: Dayjs | null) => {
		setQuery({
			input: date ? date.toISOString() : dayjs().toISOString(),
			type: "day",
		});
	};

	// Handle month changes
	const handleMonthChange = (date: Dayjs | null) => {
		setQuery({
			input: date ? date.toISOString() : dayjs().toISOString(),
			type: "month",
		});
	};

	// Handle year changes
	const handleYearChange = (date: Dayjs | null) => {
		setQuery({
			input: date ? date.toISOString() : dayjs().toISOString(),
			type: "year",
		});
	};

	return (
		<Space direction="vertical">
			<LabelCustom label="Chọn giời gian kiểm tra" />
			{/* Date Picker for day */}
			<Space>
				<DatePicker
					placeholder="Chọn ngày"
					onChange={handleDateChange}
					value={query.type === "day" ? dayjs(query.input) : null}
					allowClear={false}
					format={KEY_CONST.DATE_FORMAT}
				/>
				{/* Date Picker for month */}
				<DatePicker
					placeholder="Chọn tháng"
					picker="month"
					onChange={handleMonthChange}
					value={query.type === "month" ? dayjs(query.input) : null}
					allowClear={false}
					format={KEY_CONST.MONTH_FORMAT}
				/>
				{/* Date Picker for year */}
				<DatePicker
					placeholder="Chọn năm"
					picker="year"
					onChange={handleYearChange}
					value={query.type === "year" ? dayjs(query.input) : null}
					allowClear={false}
				/>
			</Space>
		</Space>
	);
};

export default FilterStatistic;
