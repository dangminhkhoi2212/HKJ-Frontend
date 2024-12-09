import { Select, SelectProps } from "antd";
import React from "react";

import { TPriority } from "@/types";
import { tagMapperUtil } from "@/utils";

type Props = { ignore?: TPriority[] } & SelectProps;
const { TPriorityMapper } = tagMapperUtil;
const SelectPriorityForm: React.FC<Props> = ({ ignore, ...props }) => {
	return (
		<Select
			className="min-w-28"
			allowClear
			options={Object.entries(TPriority)
				.filter(([key, status]) => !ignore?.includes(status))
				.map(([key, value]) => ({
					label: TPriorityMapper(value),
					value: key,
				}))}
			placeholder="Độ ưu tiên"
			{...props}
		></Select>
	);
};

export default SelectPriorityForm;
