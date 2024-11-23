import { Space, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

import { TStatus } from "@/types";
import { formatUtil, tagMapperUtil } from "@/utils";

import { InputCustom, LabelCustom } from "../FormCustom/InputCustom";
import { SelectStatusForm } from "../FormSelect";

type Props = { allowManagerChange?: boolean };

const { formatDate } = formatUtil;
const { TStatusColorMapper } = tagMapperUtil;
const ignoreStatus = [TStatus.DELIVERED, TStatus.CANCEL];
const OrderDateInfo: React.FC<Props> = ({ allowManagerChange }) => {
	const { getValues, control } = useFormContext();
	const [ignoreStatus, setIgnoreStatus] = useState<TStatus[]>([
		TStatus.DELIVERED,
		TStatus.CANCEL,
	]);
	const totalPrice = useWatch({ control, name: "totalPrice" });
	const order = useWatch({ control });
	console.log("🚀 ~ order:", order);

	useEffect(() => {
		if (order.status !== TStatus.NEW) {
			setIgnoreStatus((pre) => [...pre, TStatus.NEW]);
		}
	}, [order.status]);
	if (!order) return <></>;

	return (
		<div className="flex flex-col gap-2">
			<Controller
				name="status"
				control={control}
				render={({ field }) => (
					<div>
						{allowManagerChange ? (
							<Space direction="vertical">
								<LabelCustom label="Trạng thái" />
								<SelectStatusForm
									{...field}
									size="large"
									allowClear={false}
									ignoreStatus={ignoreStatus}
								/>
							</Space>
						) : (
							<p>
								Trạng thái đơn hàng:{" "}
								{TStatusColorMapper(order.status)}
							</p>
						)}
					</div>
				)}
			/>

			<p>
				Ngày đặt:{" "}
				{formatDate(order.orderDate!, {
					removeTime: true,
				})}
			</p>

			{allowManagerChange ? (
				<InputCustom
					name="expectedDeliveryDate"
					label="Ngày giao dự kiến"
					type="date"
					control={control}
				/>
			) : (
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
			)}
		</div>
	);
};

export default OrderDateInfo;
