"use client";
import { Button, Space, Table, TableProps, Tag } from "antd";
import { PaginationProps } from "antd/lib";
import { Pencil, RotateCcw, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

import { QUERY_CONST } from "@/const";
import { useRouterCustom } from "@/hooks";
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

const createColumn = ({ setJewelry }: any) => {
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
	return columns;
};

const { defaultQuery, initPagination } = QUERY_CONST;
const JewelryList: React.FC = () => {
	const forceRefresh = jewelryStore((state) => state.forceRefresh);
	const setForceRefresh = jewelryStore((state) => state.setForceRefresh);
	const setJewelry = jewelryStore((state) => state.setJewelry);
	const { searchParams, updatePathname, pathname } = useRouterCustom();
	const [query, setQuery] = React.useState<TQuery<TJewelryQuery>>({
		...defaultQuery,
		size: 30,
	});
	const [pagination, setPagination] = useState<PaginationProps>({
		...initPagination,
		showSizeChanger: false,
		pageSize: 30,
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
		updatePathname({
			query: { materialId: value, categoryId: query.categoryId?.equals },

			type: "replace",
		});
	};
	const onChangCategorySelect = (value: number) => {
		updatePathname({
			query: { categoryId: value, materialId: query.materialId?.equals },
			type: "replace",
		});
	};

	useEffect(() => {
		if (forceRefresh) {
			refresh();
			setForceRefresh(false);
		}
	}, [forceRefresh]);

	useEffect(() => {
		const materialId = searchParams.get("materialId");
		const categoryId = searchParams.get("categoryId");
		setQuery((pre) => ({
			...pre,
			page: 0,
			materialId: { equals: materialId ? Number(materialId) : null },
		}));

		setQuery((pre) => ({
			...pre,
			page: 0,
			categoryId: { equals: categoryId ? Number(categoryId) : null },
		}));
	}, [searchParams]);
	return (
		<Space direction="vertical" className="flex flex-col">
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
					value={query.materialId?.equals}
					onChange={(value) => onChangeMaterialSelect(value)}
				/>
				<SelectCategoryForm
					size="middle"
					allowClear
					hasLabel={false}
					value={query.categoryId?.equals}
					onChange={(value) => onChangCategorySelect(value)}
				/>

				<p className="text-sm text-gray-500 font-medium">
					Kết quả tìm thấy: {jewelryModelsCount || 0} sản phẩm.
				</p>
			</Space>
			<Table
				columns={createColumn(setJewelry)}
				dataSource={jewelryModels}
				rowKey="id"
				pagination={pagination}
				sticky
				onChange={handleTableChange}
				scroll={{
					x: "max-content",
					y: 350,
					scrollToFirstRowOnChange: true,
				}}
				loading={isLoadingjewelryModels || isLoadingjewelryModelsCount}
			/>
		</Space>
	);
};

export default JewelryList;
