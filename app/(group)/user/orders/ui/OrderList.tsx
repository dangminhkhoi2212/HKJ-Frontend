"use client";
import { App, Button, Space, Table, TableProps } from "antd";
import { ArrowBigRight } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

import { QUERY_CONST } from "@/const";
import { useAccountStore } from "@/providers";
import { routesUser } from "@/routes";
import { cartService, orderService } from "@/services";
import { TCartCRUD, TCartQuery, TOrder, TQuery } from "@/types";
import { formatUtil, tagMapperUtil } from "@/utils";
import { useMutation, useQueries } from "@tanstack/react-query";

const { defaultQuery, initPagination } = QUERY_CONST;
const { formatCurrency, formatDate } = formatUtil;
const { TStatusColorMapper } = tagMapperUtil;
const columns: TableProps<TOrder>["columns"] = [
	{
		title: "Mã đơn hàng",
		dataIndex: "id",
		key: "id",
		width: 150,
	},

	{
		title: "Ngày đặt",
		dataIndex: "orderDate",
		key: "orderDate",
		render(value, record, index) {
			return formatDate(value);
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
		title: "Ngày giao dự kiến",
		dataIndex: "expectedDeliveryDate",
		key: "expectedDeliveryDate",
		render(value, record, index) {
			return value ? formatDate(value) : "Chưa cập nhật";
		},
	},
	{
		title: "Ngày nhận hàng",
		dataIndex: "actualDeliveryDate",
		key: "actualDeliveryDate",
		render(value, record, index) {
			return value ? formatDate(value) : "Chưa nhận hàng";
		},
	},
	{
		title: "Tổng cộng",
		dataIndex: "totalPrice",
		key: "totalPrice",
		render(value) {
			return formatCurrency(value);
		},
	},
	{
		key: "actions",
		render(value, record, index) {
			return (
				<Link href={routesUser.orderDetail(record.id)}>
					<Button icon={<ArrowBigRight size={18} />}></Button>
				</Link>
			);
		},
	},
];
const OrderList: React.FC = () => {
	const account = useAccountStore((state) => state.account);
	const [query, setQuery] = React.useState<TQuery<TCartQuery>>({
		...defaultQuery,
		customerId: { equals: account?.id },
	});
	const [pagination, setPagination] = useState({
		...initPagination,
	});

	const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
		console.log("selectedRowKeys changed: ", newSelectedRowKeys);
	};

	const message = App.useApp().message;
	const [
		{
			data: carts,
			refetch: refreshjewelryModels,
			isLoading: isLoadingOrder,
		},
		{
			data: cartCount,
			refetch: refreshjewelryModelsCount,
			isLoading: isLoadingOrderCount,
		},
	] = useQueries({
		queries: [
			{
				queryKey: ["orders", query],
				queryFn: () => orderService.get(query),
				staleTime: 0,
			},
			{
				queryKey: ["orders-count", query],
				queryFn: () => orderService.getCount(query),
				staleTime: 0,
			},
		],
	});

	useEffect(() => {
		setPagination({ ...pagination, total: cartCount! as number });
	}, [cartCount]);

	const updateCartItem = useMutation({
		mutationFn: (data: TCartCRUD) => {
			return cartService.updatePartical({
				id: data.id,
				quantity: data.quantity,
			});
		},
		onError: () => {
			message.error("Cập nhật giỏ hàng thất bại xin thử lại");
		},
	});
	const deleteCartItem = useMutation({
		mutationFn: (data: TCartCRUD) => {
			return cartService.deleteOne(data.id!);
		},
		onSuccess(data, variables, context) {
			refresh();
		},
		onError: () => {
			message.error("Cập nhật giỏ hàng thất bại xin thử lại");
		},
	});

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
		refreshjewelryModels();
		refreshjewelryModelsCount();
	}, []);

	const handleSearch = (value: string) => {
		setQuery((pre) => ({ ...pre, page: 0, name: { contains: value } }));
	};

	const onChangeMaterialSelect = (value: number) => {
		setQuery((pre) => ({ ...pre, page: 0, materialId: { equals: value } }));
	};

	const onChangCategorySelect = (value: number) => {
		setQuery((pre) => ({ ...pre, page: 0, categoryId: { equals: value } }));
	};

	return (
		<Space direction="vertical" className="flex">
			<Table<TOrder>
				columns={columns}
				dataSource={carts}
				rowKey="id"
				pagination={pagination}
				onChange={handleTableChange}
				loading={isLoadingOrder || isLoadingOrderCount}
			/>
		</Space>
	);
};

export default OrderList;
