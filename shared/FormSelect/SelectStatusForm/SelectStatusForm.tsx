import { Select, SelectProps } from "antd";
import React from "react";

import { TStatus } from "@/types";
import { tagMapperUtil } from "@/utils";

type Props = {} & SelectProps;
const { TStatusMapper } = tagMapperUtil;
const SelectStatusForm: React.FC<Props> = ({ ...props }) => {
	return (
		<Select
			className="min-w-28"
			allowClear
			options={Object.entries(TStatus).map(([key, value]) => ({
				label: TStatusMapper(value),
				value: key,
			}))}
			placeholder="Trạng thái"
			{...props}
		></Select>
	);
};

export default SelectStatusForm;
