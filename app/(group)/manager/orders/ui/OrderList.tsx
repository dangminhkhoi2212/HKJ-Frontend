"use client";
import { Button, DatePicker, Space, Table, TableProps } from "antd";
import dayjs from "dayjs";
import { Pencil, RotateCcw } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

import { KEY_CONST, QUERY_CONST } from "@/const";
import { routesManager } from "@/routes";
import { orderService } from "@/services";
import { LabelCustom } from "@/shared/FormCustom/InputCustom";
import { InputSearchCustom } from "@/shared/FormCustom/InputSearchCustom";
import { SelectRangeDate, SelectStatusForm } from "@/shared/FormSelect";
import { TOrder, TOrderQuery, TQuery, TStatus } from "@/types";
import { formatUtil, tagMapperUtil } from "@/utils";
import { useQueries } from "@tanstack/react-query";

const columns: TableProps<TOrder>["columns"] = [
	{
		title: "Mã đơn hàng",
		dataIndex: "id",
		key: "id",
		width: 150,
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
const { RangePicker } = DatePicker;
const { TStatusColorMapper } = tagMapperUtil;
const JewelryList: React.FC = () => {
	const [query, setQuery] = React.useState<TQuery<TOrderQuery>>({
		...QUERY_CONST.defaultQuery,
	});
	console.log("🚀 ~ query:", query);
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
	const onChangeStaus = (value: number) => {
		setQuery((pre) => ({ ...pre, page: 0, status: { equals: value } }));
	};

	const onChangeOrderDate = (value: any) => {
		const [start, end] = value || [undefined, undefined];

		setQuery((pre) => ({
			...pre,
			page: 0,
			orderDate: {
				greaterThanOrEqual: start
					? dayjs(start).toISOString()
					: undefined,
				lessThanOrEqual: end
					? dayjs(end).add(1, "day").toISOString()
					: undefined,
			},
		}));
	};
	const onChangeDeliveryDate = (value: any) => {
		const [start, end] = value || [undefined, undefined];

		setQuery((pre) => ({
			...pre,
			page: 0,
			expectedDeliveryDate: {
				greaterThanOrEqual: start
					? dayjs(start).toISOString()
					: undefined,
				lessThanOrEqual: end
					? dayjs(end).add(1, "day").toISOString()
					: undefined,
			},
		}));
	};

	const handleSearch = (value: string) => {
		setQuery({ ...query, id: { contains: value } });
	};
	return (
		<Space direction="vertical" className="flex ">
			<Space className="flex-wrap items-end">
				<Button
					icon={<RotateCcw size={18} />}
					onClick={() => refresh()}
				>
					Làm mới
				</Button>
				<InputSearchCustom
					handleSearch={handleSearch}
					placeholder="Mã đơn hàng"
				/>
				<SelectStatusForm onChange={onChangeStaus} />
				<SelectRangeDate
					label="Thời gian đặt"
					onChange={onChangeOrderDate}
				/>
				<Space direction="vertical">
					<LabelCustom label="Thời gian giao hàng dự kiến" />
					<RangePicker
						onChange={onChangeDeliveryDate}
						placeholder={["Bắt đầu", "Kết thúc"]}
						format={KEY_CONST.DATE_FORMAT}
					/>
				</Space>
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
