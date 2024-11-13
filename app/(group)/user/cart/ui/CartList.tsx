"use client";
import { App, Button, InputNumber, Space, Table, TableProps } from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import { Trash } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";

import { KEY_CONST, QUERY_CONST } from "@/const";
import { useRouterCustom } from "@/hooks";
import { useAccountStore } from "@/providers";
import { routesUser } from "@/routes";
import { cartService } from "@/services";
import {
	TCart,
	TCartCRUD,
	TCartItemSession,
	TCartQuery,
	TQuery,
} from "@/types";
import { formatUtil } from "@/utils";
import { useMutation, useQueries } from "@tanstack/react-query";

import { cartStore } from "../store";

const { defaultQuery, initPagination } = QUERY_CONST;

const CartList: React.FC = () => {
	const setForceRefresh = cartStore((state) => state.setForceRefresh);
	const { router } = useRouterCustom();
	const reset = cartStore((state) => state.reset);
	const account = useAccountStore((state) => state.account);
	const [query, setQuery] = React.useState<TQuery<TCartQuery>>({
		...defaultQuery,
		customerId: { equals: account?.id },
	});
	const [pagination, setPagination] = useState({
		...initPagination,
	});
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

	const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
		console.log("selectedRowKeys changed: ", newSelectedRowKeys);
		setSelectedRowKeys(newSelectedRowKeys);
	};
	const rowSelection: TableRowSelection<TCart> = {
		selectedRowKeys,
		onChange: onSelectChange,
	};
	const message = App.useApp().message;
	const [
		{
			data: carts,
			refetch: refreshjewelryModels,
			isLoading: isLoadingjewelryModels,
		},
		{
			data: cartCount,
			refetch: refreshjewelryModelsCount,
			isLoading: isLoadingjewelryModelsCount,
		},
	] = useQueries({
		queries: [
			{
				queryKey: ["products-cart", query],
				queryFn: () => cartService.get(query),
				staleTime: 0,
			},
			{
				queryKey: ["products-cart-count", query],
				queryFn: () => cartService.getCount(query),
				staleTime: 0,
			},
		],
	});

	useEffect(() => {
		setPagination({ ...pagination, total: cartCount! as number });
		setForceRefresh(true);
	}, [cartCount]);

	useEffect(() => {
		// Initialize quantities state with current cart quantities
		if (carts) {
			const initialQuantities = carts.reduce(
				(acc, cart) => {
					acc[cart.id] = cart.quantity; // Assuming each cart item has a unique id
					return acc;
				},
				{} as { [key: string]: number }
			);
			setQuantities(initialQuantities);
		}
	}, [carts]);

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
			setForceRefresh(true);
			refresh();
		},
		onError: () => {
			message.error("Cập nhật giỏ hàng thất bại xin thử lại");
		},
	});
	const columns: TableProps<TCart>["columns"] = [
		{
			title: "Ảnh bìa",
			dataIndex: ["product", "coverImage"],
			key: "coverImage",
			width: 100,
			render(value) {
				return (
					<Image
						alt="Ảnh bìa"
						src={value}
						width={50}
						height={50}
						className="rounded overflow-hidden border border-gray-200"
					/>
				);
			},
		},
		{
			title: "Tên",
			dataIndex: ["product", "name"],
			key: "name",
		},
		{
			title: "Giá",
			dataIndex: ["product", "price"],
			key: "price",
			render(value) {
				if (!value) return 0;
				return formatUtil.formatCurrency(value);
			},
		},
		{
			title: "Số lượng",
			dataIndex: "quantity",
			key: "quantity",
			render(value, record) {
				return (
					<InputNumber
						min={1}
						max={20}
						size="large"
						value={quantities[record.id] || 1} // Use the quantity from state
						onChange={(newValue) => {
							const updatedQuantity = newValue || 1; // Default to 1 if null
							setQuantities((prev) => ({
								...prev,
								[record.id]: updatedQuantity,
							}));
							updateCartItem.mutate({
								id: record.id!,
								quantity: updatedQuantity,
							} as TCartCRUD);
						}}
					/>
				);
			},
		},

		{
			title: "Tùy chọn",
			dataIndex: "actions",
			key: "actions",
			fixed: "right",
			render: (_, record) => (
				<Space>
					<Button
						danger
						type="primary"
						icon={<Trash size={16} />}
						onClick={() => {
							deleteCartItem.mutate({
								id: record.id!,
							} as TCartCRUD);
						}}
					/>
				</Space>
			),
		},
	];

	const handleTableChange: TableProps<TCart>["onChange"] = (
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
	const handlePlace = () => {
		const cartsSelected = carts?.filter((cart) =>
			selectedRowKeys.includes(cart.id!)
		);
		const cartItemSession: TCartItemSession[] | undefined =
			cartsSelected?.map((product) => ({
				...product.product,
				quantity: quantities[product.id],
			}));
		if (typeof window !== undefined) {
			window.sessionStorage.setItem(
				KEY_CONST.PLACE_ORDER_PRODUCT,
				JSON.stringify(cartItemSession)
			);
			router.push(routesUser.createOrder);
		}
	};

	return (
		<Space direction="vertical" className="flex">
			<Table<TCart>
				columns={columns}
				dataSource={carts}
				rowKey="id"
				pagination={pagination}
				onChange={handleTableChange}
				rowSelection={rowSelection}
				loading={isLoadingjewelryModels || isLoadingjewelryModelsCount}
				footer={() => (
					<div className="flex justify-end">
						<Space>
							<Button onClick={() => handlePlace()}>
								Đặt hàng
							</Button>
						</Space>
					</div>
				)}
			/>
		</Space>
	);
};

export default CartList;
