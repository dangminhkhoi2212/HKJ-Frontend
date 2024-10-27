"use client";
import {
	Button,
	Image,
	Space,
	Table,
	TableColumnsType,
	TableProps,
	Tag,
} from "antd";
import { RotateCcw } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

import { QUERY_CONST } from "@/const";
import { jewelryImageService } from "@/services";
import { TJewelryImage, TJewelryImageQuery, TQuery } from "@/types";
import { formatUtil } from "@/utils";
import { useQueries } from "@tanstack/react-query";

type TableRowSelection<T extends object = object> =
	TableProps<T>["rowSelection"];

const columns: TableColumnsType<TJewelryImage> = [
	{
		title: "ID",
		dataIndex: "id",
		key: "id",
		width: 100,
	},
	{
		title: "Hình ảnh",
		dataIndex: "url",
		key: "url",
		width: 100,
		render(value, record, index) {
			return (
				<Image
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
		dataIndex: ["jewelryModel", "name"],
		key: "jewelryModel.name",
	},
	{
		title: "Sku",
		dataIndex: ["jewelryModel", "sku"],
		key: "jewelryModel.sku",

		render(value, record, index) {
			return <Tag className="text-xs">{value}</Tag>;
		},
	},
	{
		title: "Màu sắc",
		dataIndex: ["jewelryModel", "color"],
		key: "jewelryModel.color",
	},
	{
		title: "Giá",
		dataIndex: ["jewelryModel", "price"],
		key: "jewelryModel.price",

		render(value, record, index) {
			return formatUtil.formatCurrency(value);
		},
	},
	{
		title: "Tạo bởi",
		dataIndex: ["jewelryModel", "createdBy"],
		key: "jewelryModel.createdBy",
		render(value, record, index) {
			return formatUtil.formatDate(value.createdBy);
		},
	},
	{
		title: "Tạo bởi",
		dataIndex: ["jewelryModel", "createdDate"],
		key: "jewelryModel.createdDate",
		render(value, record, index) {
			return formatUtil.formatDate(value.createdDate);
		},
	},
	{
		title: "Tạo bởi",
		dataIndex: ["jewelryModel", "lastModifiedDate"],
		key: "jewelryModel.lastModifiedDate",
		render(value, record, index) {
			return formatUtil.formatDate(value.lastModifiedDate);
		},
	},
];
const JewelryList: React.FC = () => {
	const [query, setQuery] = React.useState<TQuery<TJewelryImageQuery>>({
		...QUERY_CONST.defaultQuery,
	});
	const [pagination, setPagination] = useState({
		...QUERY_CONST.initPagination,
	});
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
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
				queryKey: ["jewelry-images-model", { ...query }],
				queryFn: () => jewelryImageService.get(query),
			},
			{
				queryKey: ["jewelry-model-images-count", { ...query }],
				queryFn: () => jewelryImageService.getCount(query),
			},
		],
	});
	useEffect(() => {
		setPagination({ ...pagination, total: jewelryModelsCount as number });
	}, [jewelryModelsCount]);

	const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
		console.log("selectedRowKeys changed: ", newSelectedRowKeys);
		setSelectedRowKeys(newSelectedRowKeys);
	};
	const rowSelection: TableRowSelection<TJewelryImage> = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const refresh = useCallback(() => {
		refreshjewelryModels();
		refreshjewelryModelsCount();
	}, []);
	// const handleSearch = (value: string) => {
	// 	setQuery({ ...query, jewelryModelId: { contains: value } });
	// };
	return (
		<Space direction="vertical" className="flex">
			<Space>
				<Button
					icon={<RotateCcw size={18} />}
					onClick={() => refresh()}
				>
					Làm mới
				</Button>
				{/* <InputSearchCustom handleSearch={handleSearch} /> */}
			</Space>
			<Table<TJewelryImage>
				columns={columns}
				dataSource={jewelryModels}
				rowKey="id"
				pagination={{ position: ["bottomRight"] }}
				scroll={{ x: 1500, scrollToFirstRowOnChange: true }}
				rowSelection={rowSelection}
				loading={isLoadingjewelryModels || isLoadingjewelryModelsCount}
			/>
		</Space>
	);
};

export default JewelryList;
