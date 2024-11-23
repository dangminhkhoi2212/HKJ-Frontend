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
};

const OrderNoteForm: React.FC<Props> = ({ control, name, disabled }) => {
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
						value={field.value || "Không tìm thấy"}
						onChange={field.onChange}
						readOnly={disabled}
					/>
				)}
			/>
		</Space>
	);
};

export default OrderNoteForm;
