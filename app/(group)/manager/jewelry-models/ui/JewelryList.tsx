import { Button, Image, Space, Table, TableProps, Tag } from "antd";
import { RotateCcw } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useQueries } from "react-query";

import { QUERY_CONST } from "@/const";
import { jewelryService } from "@/services";
import { TQuery } from "@/types";
import { TJewelry } from "@/types/jewelryType";

const JewelryList: React.FC = () => {
	const [query, setQuery] = React.useState<TQuery<{}>>({
		...QUERY_CONST.defaultQuery,
	});
	const [pagination, setPagination] = useState({
		...QUERY_CONST.initPagination,
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
	] = useQueries([
		{
			queryKey: ["jewelry-model", { ...query }],
			queryFn: () => jewelryService.get(query),
		},
		{
			queryKey: ["jewelry-model-count", { ...query }],
			queryFn: () => jewelryService.getCount(query),
			onSuccess(data: number) {
				setPagination({ ...pagination, total: data });
			},
		},
	]);
	const columns: TableProps<TJewelry>["columns"] = [
		{
			title: "Ảnh bìa",
			dataIndex: "coverImage",
			key: "coverImage",
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
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Màu sắc",
			dataIndex: "color",
			key: "color",
		},
		{
			title: "Giá",
			dataIndex: "price",
			key: "price",
		},

		{
			title: "Đã kích hoạt",
			dataIndex: "activated",
			key: "activated",
			render: (value: boolean) =>
				value ? (
					<Tag color="green">Đã kích hoạt</Tag>
				) : (
					<Tag color="red">Chưa kích hoạt</Tag>
				),
		},
	];
	const refresh = useCallback(() => {
		refreshjewelryModels();
		refreshjewelryModelsCount();
	}, []);

	return (
		<Space direction="vertical" className="flex">
			<Button icon={<RotateCcw size={18} onClick={() => refresh()} />}>
				Làm mới
			</Button>
			<Table
				columns={columns}
				dataSource={jewelryModels}
				rowKey="id"
				loading={isLoadingjewelryModels || isLoadingjewelryModelsCount}
			/>
		</Space>
	);
};

export default JewelryList;
