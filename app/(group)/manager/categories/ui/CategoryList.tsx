"use client";
import { Button, Space, Table, TableProps } from "antd";
import { Pencil, RotateCw, Trash } from "lucide-react";
import React, { useCallback, useEffect } from "react";

import categoryService from "@/services/categoryService";
import { TCategory } from "@/types";
import { formatUtil } from "@/utils";
import { useQueries } from "@tanstack/react-query";

import categoryStore from "../store";

type TProps = {};
const CategoryList: React.FC<TProps> = ({}) => {
	const {
		setCategoryUpdate,
		setOpenDrawer,
		setCategoryDelete,
		pagination,
		setQuery,
		query,
		setPagination,
		reset,
		toggleRefresh,
	} = categoryStore();
	const handleTableChange: TableProps<TCategory>["onChange"] = (
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

	const [
		{
			data: categories,
			refetch: refreshCategories,
			isLoading: isLoadingCategories,
		},
		{
			data: categoriesCount,
			refetch: refreshCategoriesCount,
			isLoading: isLoadingCategoriesCount,
			isSuccess: isSuccessCategoriesCount,
		},
	] = useQueries({
		queries: [
			{
				queryKey: ["categories", { ...query }],
				queryFn: () => categoryService.get(query),
			},
			{
				queryKey: ["categories-count", { ...query }],
				queryFn: () => categoryService.getCount(query),
			},
		],
	});
	useEffect(() => {
		if (isSuccessCategoriesCount) {
			setPagination({ total: categoriesCount as number });
		}
	}, [isSuccessCategoriesCount, categoriesCount]);
	const refresh = useCallback(() => {
		refreshCategories();
		refreshCategoriesCount();

		setPagination({ current: 1 });
		setQuery({ ...query, page: 0 });
	}, []);

	useEffect(() => {
		refresh();
	}, [toggleRefresh, refresh]);
	const columns: TableProps<TCategory>["columns"] = [
		{
			title: "Tên loại",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Tạo bởi",
			dataIndex: "createdBy",
			key: "createdBy",
		},
		{
			title: "Ngày tạo",
			dataIndex: "createdDate",
			key: "createdDate",
			render(value, record, index) {
				return formatUtil.formatDate(value);
			},
		},
		{
			title: "Ngày chỉnh sửa",
			dataIndex: "lastModifiedDate",
			key: "lastModifiedDate",
			render(value, record, index) {
				return formatUtil.formatDate(value);
			},
		},
		{
			title: "Tùy chọn",
			dataIndex: "actions",
			key: "actions",

			render: (value, record, index) => (
				<Space>
					<Button
						icon={<Pencil size={18} />}
						onClick={() => {
							setCategoryUpdate(record);
							setOpenDrawer(true);
						}}
					/>
					<Button
						type="primary"
						danger
						icon={<Trash size={18} />}
						onClick={() => setCategoryDelete(record)}
					/>
				</Space>
			),
		},
	];
	useEffect(() => {
		return () => {
			reset();
		};
	}, []);
	return (
		<Space direction="vertical" className="flex">
			<Button onClick={() => refresh()} icon={<RotateCw size={18} />}>
				Làm mới
			</Button>
			<Table
				columns={columns}
				className="min-h-80"
				dataSource={categories}
				rowKey="id"
				loading={isLoadingCategories || isLoadingCategoriesCount}
				pagination={pagination}
				onChange={handleTableChange}
			/>
		</Space>
	);
};

export default CategoryList;
