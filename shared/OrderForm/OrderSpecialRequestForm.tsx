import { Space, Tag } from "antd";
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

const OrderSpecialRequesteForm: React.FC<Props> = ({
	control,
	name,
	disabled,
}) => {
	return (
		<Space direction="vertical" className="flex">
			<LabelCustom label="Yêu cầu cụ thể" required={false} classname="" />
			<Tag className="text-wrap italic">
				Thông tin này giúp chúng tôi có thể tạo ra sản phẩm giống ý bạn
				hơn
			</Tag>
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

export default OrderSpecialRequesteForm;
