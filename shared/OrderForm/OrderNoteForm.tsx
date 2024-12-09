import { Space } from "antd";
import dynamic from "next/dynamic";
import React from "react";
import { Controller } from "react-hook-form";

import { LabelCustom } from "@/shared/FormCustom/InputCustom";

const ReactQuill = dynamic(() => import("react-quill-new"), {
	ssr: false,
});
type Props = {
	control: any;
	name: string;
	disabled?: boolean;
	role: "manager" | "user";
};

const OrderNoteForm: React.FC<Props> = ({
	control,
	name,
	disabled,
	role = "user",
}) => {
	return (
		<Space direction="vertical" className="flex">
			<LabelCustom
				label="Ghi chú của cửa hàng"
				required={false}
				classname=""
			/>

			<Controller
				control={control}
				name={name}
				render={({ field }) => (
					<ReactQuill
						modules={{
							toolbar: !disabled,
						}}
						value={field.value}
						onChange={field.onChange}
						readOnly={role === "user" || disabled}
					/>
				)}
			/>
		</Space>
	);
};

export default OrderNoteForm;
