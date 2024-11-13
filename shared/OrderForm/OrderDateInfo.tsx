import { Tag } from "antd";
import React from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { formatUtil, tagMapperUtil } from "@/utils";

type Props = {};

const { formatDate } = formatUtil;
const { TStatusColorMapper } = tagMapperUtil;
const OrderDateInfo: React.FC<Props> = ({}) => {
	const { getValues, control } = useFormContext();
	const totalPrice = useWatch({ control, name: "totalPrice" });
	const order = getValues();
	console.log("🚀 ~ order:", order);
	if (!order) return <></>;
	return (
		<div className="flex flex-col gap-2">
			{order?.id && (
				<p>Trạng thái đơn hàng: {TStatusColorMapper(order.status)}</p>
			)}
			<p>
				Ngày đặt:{" "}
				{formatDate(order.orderDate!, {
					removeTime: true,
				})}
			</p>
			<p>
				Ngày giao dự kiến:{" "}
				{order.expectedDeliveryDate ? (
					formatDate(order.expectedDeliveryDate!, {
						removeTime: true,
					})
				) : (
					<Tag>Đang cập nhật</Tag>
				)}
			</p>
			<p>
				Tổng thanh toán:{" "}
				{totalPrice ? (
					formatUtil.formatCurrency(totalPrice)
				) : (
					<Tag>Đang cập nhật</Tag>
				)}
			</p>
		</div>
	);
};

export default OrderDateInfo;
