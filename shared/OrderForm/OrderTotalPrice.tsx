import { Space } from "antd";
import React from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { TStatus } from "@/types";
import { formatUtil } from "@/utils";

import { InputNumberCustom, LabelCustom } from "../FormCustom/InputCustom";
import NumberToWords from "../FormCustom/InputNumToWords/InputNumToWords";

type Props = { role: "manager" | "user" };
const { formatCurrency } = formatUtil;
const OrderTotalPrice: React.FC<Props> = ({ role }) => {
	const { control } = useFormContext();
	const status = useWatch({ control, name: "status" });
	const totalPrice = useWatch({ control, name: "totalPrice" });
	if (role === "user") {
		return (
			<Space direction="vertical">
				{totalPrice ? (
					<>
						<LabelCustom label="Tổng thanh toán" />
						<Space direction="vertical">
							<p className="font-semibold">
								{formatCurrency(totalPrice)}
							</p>
							<NumberToWords number={totalPrice} />
						</Space>
					</>
				) : (
					<p>
						Bạn sẽ nhìn thấy tổng thanh toán khi cửa hàng xác nhận
						đơn hàng.
					</p>
				)}
			</Space>
		);
	}
	if (role === "manager") {
		if ([TStatus.CANCEL].includes(status)) return <></>;
		if ([TStatus.COMPLETED, TStatus.DELIVERED].includes(status))
			return (
				<Space direction="vertical" align="start">
					<LabelCustom label="Tổng thanh toán" />
					<p>{formatCurrency(totalPrice)}</p>
					<NumberToWords number={totalPrice} />
				</Space>
			);
		return (
			<InputNumberCustom
				name="totalPrice"
				label="Tổng thanh toán"
				control={control}
				required={role === "manager"}
				disabled={[TStatus.COMPLETED, TStatus.DELIVERED].includes(
					status
				)}
			/>
		);
	}
};

export default OrderTotalPrice;
