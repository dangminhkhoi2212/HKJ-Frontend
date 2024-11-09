"use client";
import { Button, Empty, List, Skeleton, TablePaginationConfig } from "antd";
import { RotateCcw } from "lucide-react";
import React, { useEffect, useState } from "react";

import { QUERY_CONST } from "@/const";
import { materialService } from "@/services";
import { TMaterial, TMaterialImageQuery, TQuery } from "@/types";
import { useQueries } from "@tanstack/react-query";

import MaterialCard from "./MaterialCard";

type Props = {};

const MaterialList: React.FC<Props> = () => {
	const [pagination, setPagination] = useState<TablePaginationConfig>(
		QUERY_CONST.initPagination
	);
	const [query, setQuery] = useState<TQuery<TMaterialImageQuery>>({
		...QUERY_CONST.defaultQuery,
	});

	const [getMaterialQuery, getMaterialCountQuery] = useQueries({
		queries: [
			{
				queryKey: ["material", query],
				queryFn: () => materialService.get(query),
			},
			{
				queryKey: ["material-count", query],
				queryFn: () => materialService.getCount(query),
			},
		],
	});
	const isLoading =
		getMaterialQuery.isPending || getMaterialCountQuery.isPending;
	useEffect(() => {
		setPagination((pre) => ({ ...pre, total: getMaterialCountQuery.data }));
	}, [getMaterialCountQuery.data, getMaterialCountQuery.refetch]);
	if (!getMaterialQuery?.data?.length) {
		return (
			<div className="flex justify-center items-center w-full">
				<Empty description="Không có dữ liệu" />
			</div>
		);
	}
	const refesh = () => {
		getMaterialQuery.refetch();
		getMaterialCountQuery.refetch();
	};

	return (
		<div className="flex flex-col gap-4">
			<div>
				<Button onClick={() => refesh()} icon={<RotateCcw size={18} />}>
					làm mới
				</Button>
			</div>

			<List
				grid={{
					gutter: 16,
					xs: 1,
					sm: 2,
					md: 3,
					lg: 4,
					xl: 5,
					xxl: 5,
				}}
				dataSource={
					isLoading
						? Array.from({ length: 4 }).map(
								(_, idx) =>
									({
										id: idx,
										coverImage: "",
										name: "",
										quantity: 0,
										price: 0,
										unit: "",
										pricePerUnit: 0,
										supplier: "",
									}) as TMaterial
							)
						: getMaterialQuery.data
				}
				renderItem={(item: TMaterial, index) => (
					<List.Item
						key={item.id}
						className="flex justify-center items-center"
					>
						{isLoading ? (
							<Skeleton
								active
								paragraph={{ rows: 3 }}
								rootClassName="flex flex-col"
								key={item.id}
							/>
						) : (
							<MaterialCard data={item} key={item.id} />
						)}
					</List.Item>
				)}
			/>
		</div>
	);
};

export default MaterialList;
