"use client";
import { Button, Space, Table, TableProps, Tag } from "antd";
import { Pencil, RotateCcw, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

import { QUERY_CONST } from "@/const";
import { routesManager } from "@/routes";
import { jewelryService } from "@/services";
import { InputSearchCustom } from "@/shared/FormCustom/InputSearchCustom";
import { SelectMaterialForm } from "@/shared/FormSelect";
import { SelectCategoryForm } from "@/shared/FormSelect/SelectCategoryForm";
import { TQuery } from "@/types";
import { TJewelry, TJewelryQuery } from "@/types/jewelryType";
import { formatUtil } from "@/utils";
import { useQueries } from "@tanstack/react-query";

import { jewelryStore } from "../store";
import DeleteJewelryModal from "./DeleteJewelryModal";

const { defaultQuery, initPagination } = QUERY_CONST;
const JewelryList: React.FC = () => {
	const forceRefresh = jewelryStore((state) => state.forceRefresh);
	const setForceRefresh = jewelryStore((state) => state.setForceRefresh);
	const setJewelry = jewelryStore((state) => state.setJewelry);
	const [query, setQuery] = React.useState<TQuery<TJewelryQuery>>({
		...defaultQuery,
	});
	const [pagination, setPagination] = useState({
		...initPagination,
	});

	const [
		{
			data: jewelryModels,
			refetch: refreshjewelryModels,
			isLoading: isLoadingjewelryModels,
		},
		{
			data: jewelryModelsCount,
			refetch: refreshjewelryModelsCount,
			isLoading: isLoadingjewelryModelsCount,
		},
	] = useQueries({
		queries: [
			{
				queryKey: ["jewelry-model", { ...query }],
				queryFn: () => jewelryService.get(query),
			},
			{
				queryKey: ["jewelry-model-count", { ...query }],
				queryFn: () => jewelryService.getCount(query),
			},
		],
	});
	useEffect(() => {
		setPagination({ ...pagination, total: jewelryModelsCount as number });
	}, [jewelryModelsCount]);
	const columns: TableProps<TJewelry>["columns"] = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
			width: 100,
		},
		{
			title: "SKU",
			dataIndex: "sku",
			key: "sku",
			width: 180,
			render(value, record, index) {
				return <Tag className="text-xs">{value}</Tag>;
			},
		},
		{
			title: "Ảnh bìa",
			dataIndex: "coverImage",
			key: "coverImage",
			width: 100,
			render(value, record, index) {
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
			dataIndex: "name",
			key: "name",
			width: 200,
		},

		{
			title: "Giá",
			dataIndex: "price",
			key: "price",

			render(value, record, index) {
				return formatUtil.formatCurrency(value);
			},
		},
		{
			title: "Loại",
			dataIndex: ["category", "name"],
			key: "category.name",
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
			fixed: "right",

			render: (_, record) => (
				<Space>
					<Link href={routesManager.updateJewelry(record.id)}>
						<Button color="primary" icon={<Pencil size={16} />} />
					</Link>
					<Button
						danger
						type="primary"
						icon={<Trash size={16} />}
						onClick={() => {
							setJewelry(record);
						}}
					/>
				</Space>
			),
		},
	];
	const handleTableChange: TableProps<TJewelry>["onChange"] = (
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

	useEffect(() => {
		if (forceRefresh) {
			refresh();
			setForceRefresh(false);
		}
	}, [forceRefresh]);
	return (
		<Space direction="vertical" className="flex">
			<DeleteJewelryModal />
			<Space>
				<Button
					icon={<RotateCcw size={18} />}
					onClick={() => refresh()}
				>
					Làm mới
				</Button>
				<InputSearchCustom handleSearch={handleSearch} />
				<SelectMaterialForm
					size="middle"
					allowClear
					hasLabel={false}
					onChange={(value) => onChangeMaterialSelect(value)}
				/>
				<SelectCategoryForm
					size="middle"
					allowClear
					hasLabel={false}
					onChange={(value) => onChangCategorySelect(value)}
				/>
			</Space>
			<Table
				columns={columns}
				dataSource={jewelryModels}
				rowKey="id"
				pagination={pagination}
				onChange={handleTableChange}
				scroll={{ x: 1800, scrollToFirstRowOnChange: true }}
				loading={isLoadingjewelryModels || isLoadingjewelryModelsCount}
			/>
		</Space>
	);
};

export default JewelryList;
