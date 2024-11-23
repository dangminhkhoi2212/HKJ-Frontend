"use client";
import {
	App,
	Button,
	Space,
	Table,
	TableColumnsType,
	TableProps,
	Tag,
} from "antd";
import { RotateCcw, ScanSearch } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";

import { KEY_CONST, QUERY_CONST } from "@/const";
import { imageSearchAIService, jewelryService } from "@/services";
import { InputSearchCustom } from "@/shared/FormCustom/InputSearchCustom";
import { TImageSearchAI, TQuery } from "@/types";
import { TJewelry, TJewelryQuery } from "@/types/jewelryType";
import { formatUtil } from "@/utils";
import { useMutation, useQueries } from "@tanstack/react-query";

type TableRowSelection<T extends object = object> =
	TableProps<T>["rowSelection"];

const columns: TableColumnsType<TJewelry> = [
	{
		title: "Ảnh bìa",
		dataIndex: "coverImage",
		key: "coverImage",
		width: 100,
		render(value, record, index) {
			return (
				<Image
					alt="Ảnh"
					src={value}
					width={50}
					height={50}
					className="rounded overflow-hidden border border-gray-200"
				/>
			);
		},
	},
	{
		title: "Sử dụng",
		dataIndex: "isCoverSearch",
		key: "isCoverSearch",
		render(value, record, index) {
			return value ? (
				<Tag color="green">Đã dùng</Tag>
			) : (
				<Tag color="red">Chưa dùng</Tag>
			);
		},
	},
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
		render(value, record, index) {
			return <Tag className="text-xs">{value}</Tag>;
		},
	},

	{
		title: "Tên",
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
];
const JewelryList: React.FC = () => {
	const [query, setQuery] = React.useState<TQuery<TJewelryQuery>>({
		...QUERY_CONST.defaultQuery,
		// isCoverSearch: { equals: false },
	});
	const [pagination, setPagination] = useState({
		...QUERY_CONST.initPagination,
	});
	const message = App.useApp().message;
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

	const refresh = useCallback(() => {
		refreshjewelryModels();
		refreshjewelryModelsCount();
	}, []);

	const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
		console.log("selectedRowKeys changed: ", newSelectedRowKeys);
		setSelectedRowKeys(newSelectedRowKeys);
	};
	const rowSelection: TableRowSelection<TJewelry> = {
		selectedRowKeys,
		onChange: onSelectChange,
		// getCheckboxProps: (record: TJewelry) => ({
		// 	disabled: record.isCoverSearch,
		// 	name: record.name,
		// }),
	};
	const handleSearch = (value: string) => {
		setQuery({ ...query, name: { contains: value } });
	};
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
	const handleAllowSearch = async () => {
		const images = jewelryModels?.filter((jewelry) =>
			selectedRowKeys.includes(jewelry.id)
		);
		if (!images?.length) return;
		const data: TImageSearchAI[] = images.map((item) => ({
			id: item.id,
			jewelryId: item.id,
			url: item.coverImage,
		}));
		console.log("🚀 ~ constdata:TImageSearchAI[]=images.map ~ data:", data);
		await imageSearchAIService.imageToVector(data);
	};
	const updateInDB = async () => {
		const images = jewelryModels?.filter((jewelry) =>
			selectedRowKeys.includes(jewelry.id)
		);
		if (!images?.length) return;
		const data: TJewelry[] = images.map((item) => ({
			...item,
			isCoverSearch: true,
		}));
		console.log("🚀 ~ constdata:TImageSearchAI[]=images.map ~ data:", data);
		await Promise.all(
			data.map(async (item) => await jewelryService.update(item))
		);
	};
	const allowSearchMutation = useMutation({
		mutationFn: () => {
			return Promise.all([handleAllowSearch(), updateInDB()]);
		},
		onSuccess() {
			message.success("Đã cho phép tìm kiếm");
			setSelectedRowKeys([]);
			refresh();
		},
		onError(error: any) {
			console.log("🚀 ~ onSuccess ~ error:", error);
			message.error(KEY_CONST.ERROR_MESSAGE);
		},
	});
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
				<Button
					icon={<ScanSearch size={18} />}
					type="primary"
					onClick={() => allowSearchMutation.mutate()}
					loading={allowSearchMutation.isPending}
				>
					Cho phép tìm kiếm
				</Button>
			</Space>
			<Table<TJewelry>
				columns={columns}
				dataSource={jewelryModels}
				rowKey="id"
				rowSelection={rowSelection}
				onChange={handleTableChange}
				pagination={pagination}
				scroll={{ x: 1500, scrollToFirstRowOnChange: true }}
				loading={isLoadingjewelryModels || isLoadingjewelryModelsCount}
			/>
		</Space>
	);
};

export default JewelryList;
