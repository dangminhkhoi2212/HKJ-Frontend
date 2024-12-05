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
	role: "manager" | "user";
};

const OrderSpecialRequesteForm: React.FC<Props> = ({
	control,
	name,
	disabled,
	role = "user",
}) => {
	return (
		<Space direction="vertical" className="flex">
			<LabelCustom label="Yêu cầu cụ thể" required={false} classname="" />
			{role === "user" && (
				<Tag className="text-wrap italic">
					Thông tin này giúp chúng tôi có thể tạo ra sản phẩm giống ý
					bạn hơn
				</Tag>
			)}
			<Controller
				control={control}
				name={name}
				render={({ field, fieldState }) => (
					<div>
						<ReactQuill
							modules={{
								toolbar: !disabled,
							}}
							value={field.value}
							onChange={field.onChange}
							readOnly={disabled}
							placeholder="Nếu không có yêu cầu hãy ghi không"
						/>
						<span className="text-red-500">
							{fieldState.error?.message}
						</span>
					</div>
				)}
			/>
		</Space>
	);
};

export default OrderSpecialRequesteForm;
