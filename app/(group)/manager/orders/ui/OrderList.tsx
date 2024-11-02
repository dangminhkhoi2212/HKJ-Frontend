"use client";
import { Button, Space, Table, TableProps } from "antd";
import { Pencil, RotateCcw } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

import { QUERY_CONST } from "@/const";
import { routesManager } from "@/routes";
import { orderService } from "@/services";
import { InputSearchCustom } from "@/shared/FormCustom/InputSearchCustom";
import { TOrder, TOrderQuery, TQuery, TStatus } from "@/types";
import { formatUtil, tagMapperUtil } from "@/utils";
import { useQueries } from "@tanstack/react-query";

const { TStatusColorMapper } = tagMapperUtil;
const JewelryList: React.FC = () => {
	const [query, setQuery] = React.useState<TQuery<TOrderQuery>>({
		...QUERY_CONST.defaultQuery,
	});
	const [pagination, setPagination] = useState({
		...QUERY_CONST.initPagination,
	});

	const [
		{ data: orders, refetch: refetchOrders, isFetching: isLoadingOrders },
		{
			data: orderCount,
			refetch: refetchOrderCount,
			isFetching: isLoadingOrderCount,
		},
	] = useQueries({
		queries: [
			{
				queryKey: ["order", { ...query }],
				queryFn: () => orderService.get(query),
			},
			{
				queryKey: ["order-count", { ...query }],
				queryFn: () => orderService.getCount(query),
			},
		],
	});
	useEffect(() => {
		setPagination({ ...pagination, total: orderCount as number });
	}, [orderCount]);
	const columns: TableProps<TOrder>["columns"] = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
			width: 100,
		},

		{
			title: "Tên khách hàng",
			dataIndex: ["customer", "user"],
			key: "customer",
			render(value, record, index) {
				return <p>{value?.firstName + " " + value?.lastName}</p>;
			},
		},
		{
			title: "Loại trang sức",
			dataIndex: ["category", "name"],
			key: "category",
		},
		{
			title: "Trạng thái",
			dataIndex: "status",
			key: "status",
			render(value, record, index) {
				return TStatusColorMapper(value);
			},
		},

		{
			title: "Ngày đặt",
			dataIndex: "orderDate",
			key: "orderDate",

			render(value, record, index) {
				return formatUtil.formatDate(value);
			},
		},
		{
			title: "Ngày giao dự kiến",
			dataIndex: "expectedDeliveryDate",
			key: "expectedDeliveryDate",

			render(value, record, index) {
				if (record.status === TStatus.CANCEL) {
					return tagMapperUtil.TStatusColorMapper(TStatus.CANCEL);
				}
				return value
					? formatUtil.formatDate(value, { removeTime: true })
					: "Đang cập nhật";
			},
		},
		{
			title: "Ngày nhận hàng",
			dataIndex: "actualDeliveryDate",
			key: "actualDeliveryDate",

			render(value, record, index) {
				if (record.status === TStatus.CANCEL) {
					return tagMapperUtil.TStatusColorMapper(TStatus.CANCEL);
				}
				return value ? formatUtil.formatDate(value) : "Đang cập nhật";
			},
		},
		{
			title: "Ngày cập nhật",
			dataIndex: "modifiedDate",
			key: "modifiedDate",

			render(value, record, index) {
				return formatUtil.formatDate(value);
			},
		},
		{
			title: "Tùy chọn",
			dataIndex: "actions",
			key: "actions",
			fixed: "right",
			width: 100,
			render: (_, record) => (
				<Space>
					<Link href={routesManager.updateOrder(record.id)}>
						<Button color="primary" icon={<Pencil size={16} />} />
					</Link>
				</Space>
			),
		},
	];
	const handleTableChange: TableProps<TOrder>["onChange"] = (
		pagination,
		filters,
		sorter
	) => {
		setQuery({
			...query,
			page: pagination.current! - 1,
		});
		setPagination(pagination);
	};
	const refresh = useCallback(() => {
		refetchOrders();
		refetchOrderCount();
	}, []);
	const handleSearch = (value: string) => {
		// setQuery({ ...query, name: { contains: value } });
	};
	return (
		<Space direction="vertical" className="flex">
			<Space>
				<Button
					icon={<RotateCcw size={18} />}
					onClick={() => refresh()}
				>
					Làm mới
				</Button>
				<InputSearchCustom handleSearch={handleSearch} />
			</Space>
			<Table
				columns={columns}
				dataSource={orders}
				rowKey="id"
				pagination={pagination}
				onChange={handleTableChange}
				scroll={{ x: 1500, scrollToFirstRowOnChange: true }}
				loading={isLoadingOrders || isLoadingOrderCount}
			/>
		</Space>
	);
};

export default JewelryList;
