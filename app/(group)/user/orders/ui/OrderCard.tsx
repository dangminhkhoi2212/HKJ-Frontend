import { Button, Descriptions } from 'antd';
import { DescriptionsProps } from 'antd/lib';
import { ChevronsRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { routesUser } from '@/routes';
import { OrderProductCard } from '@/shared/CardCustom';
import { TOrder } from '@/types';
import { formatUtil, tagMapperUtil } from '@/utils';

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
			key: "catergory",
			label: "Loại trang sức",
			children: order?.category?.name,
			span: 1,
		},

		{
			key: "totalPrice",
			label: "Tổng tiền",
			children: order?.totalPrice
				? formatCurrency(order?.totalPrice!)
				: "Đang cập nhật",
			span: 1,
		},
		{
			key: "expectedDeliveryDate",
			label: "Ngày giao dự kiến",
			children: order.expectedDeliveryDate
				? formatDate(order.expectedDeliveryDate)
				: "Đang cập nhật",

			span: 1,
		},
		{
			key: "specialRequests",
			label: "Mô tả",
			children: (
				<p
					dangerouslySetInnerHTML={{ __html: order.specialRequests }}
				></p>
			),

			span: 4,
		},
		{
			key: "jewelry",
			label: "Sản phẩm mẫu",
			children: order.jewelry?.id ? (
				<OrderProductCard jewelry={order.jewelry} />
			) : (
				"Không có"
			),

			span: 4,
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
