import { Select, SelectProps } from "antd";
import React from "react";

import { TStatus } from "@/types";
import { tagMapperUtil } from "@/utils";

type Props = { ignoreStatus?: TStatus[] } & SelectProps;
const { TStatusMapper } = tagMapperUtil;
const SelectStatusForm: React.FC<Props> = ({ ignoreStatus, ...props }) => {
	return (
		<Select
			className="min-w-28"
			allowClear
			options={Object.entries(TStatus)
				.filter(([key, status]) => !ignoreStatus?.includes(status))
				.map(([key, value]) => ({
					label: TStatusMapper(value),
					value: key,
				}))}
			placeholder="Trạng thái"
			{...props}
		></Select>
	);
};

export default SelectStatusForm;
