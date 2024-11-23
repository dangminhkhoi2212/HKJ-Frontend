import { Tag } from "antd";
import React from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { formatUtil } from "@/utils";

import { InputNumberCustom } from "../FormCustom/InputCustom";

type Props = { role: "manager" | "user" };
const { formatCurrency } = formatUtil;
const OrderTotalPrice: React.FC<Props> = ({ role }) => {
	const { control } = useFormContext();
	const totalPrice = useWatch({ control, name: "totalPrice" });
	if (role === "user") {
		return totalPrice ? (
			formatCurrency(totalPrice)
		) : (
			<Tag>Đang cập nhật</Tag>
		);
	}

	return (
		<InputNumberCustom
			name="totalPrice"
			label="Tổng thanh toán"
			control={control}
		/>
	);
};

export default OrderTotalPrice;
