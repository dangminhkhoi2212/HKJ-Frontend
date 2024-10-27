import { Button, Descriptions } from "antd";
import { DescriptionsProps } from "antd/lib";
import { ChevronsRight } from "lucide-react";
import Link from "next/link";
import React from "react";

import { routesUser } from "@/routes";
import { TOrder } from "@/types";
import { formatUtil, tagMapperUtil } from "@/utils";

type Props = { order: TOrder };
const { TStatusColorMapper } = tagMapperUtil;
const { formatDate, formatCurrency } = formatUtil;
const OrderCard: React.FC<Props> = ({ order }) => {
	const items: DescriptionsProps["items"] = [
		{
			key: "orderDate",
			label: "Ngày đặt",
			children: formatDate(order.orderDate),
			span: 1,
		},
		{
			key: "budget",
			label: "Ngân sách yêu cầu",
			children: formatCurrency(order?.budget!),
			span: 1,
		},
		{
			key: "actualDeliveryDate",
			label: "Ngày mong đợi giao",
			children: formatDate(order.expectedDeliveryDate),
			span: 1,
		},
		{
			key: "catergory",
			label: "Loại trang sức",
			children: order?.category?.name,
			span: 1,
		},

		{
			key: "budget",
			label: "Giá hoàn thành",
			children: order?.totalPrice
				? formatCurrency(order?.totalPrice!)
				: "Đang cập nhật",
			span: 2,
		},
		{
			key: "actualDeliveryDate",
			label: "Ngày giao",
			children: order.actualDeliveryDate
				? formatDate(order.actualDeliveryDate)
				: "Đang cập nhật",
			span: 2,
		},
	];
	return (
		<div className="flex flex-col gap-2 bg-white p-4 rounded-lg ">
			<div className="flex gap-2">
				<div>{TStatusColorMapper(order.status)}</div>
				<Link href={routesUser.orderDetail(order.id)} key={order.id}>
					<Button
						key={order.id}
						size="small"
						icon={<ChevronsRight size={18} />}
						iconPosition="end"
					>
						Xem
					</Button>
				</Link>
			</div>
			<Descriptions
				layout="vertical"
				bordered
				items={items}
				className="w-full"
				column={{ xs: 2, sm: 2, md: 4, lg: 4, xl: 4, xxl: 4 }}
			/>
		</div>
	);
};

export default OrderCard;
