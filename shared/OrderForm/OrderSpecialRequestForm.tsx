import { Space } from "antd";
import dynamic from "next/dynamic";
import React from "react";
import { Controller } from "react-hook-form";

import { LabelCustom } from "@/shared/FormCustom/InputCustom";

const ReactQuill = dynamic(() => import("react-quill-new"), {
	ssr: false,
});
type Props = { control: any; name: string; disabled?: boolean };

const OrderSpecialRequesteForm: React.FC<Props> = ({
	control,
	name,
	disabled,
}) => {
	return (
		<Space direction="vertical" className="flex">
			<LabelCustom label="Ghi chú" required={false} classname="" />
			<Controller
				control={control}
				name={name}
				render={({ field }) => (
					<ReactQuill
						value={field.value}
						onChange={field.onChange}
						readOnly={disabled}
					/>
				)}
			/>
		</Space>
	);
};

export default OrderSpecialRequesteForm;
