"use client";
import { Card, List, Pagination, Skeleton } from "antd";
import { PaginationProps } from "antd/lib";
import React, { useEffect, useState } from "react";

import { QUERY_CONST } from "@/const";
import { useRouterCustom } from "@/hooks";
import { imageSearchAIService, jewelryService } from "@/services";
import { ProductCard } from "@/shared/CardCustom";
import { EmptyCustom } from "@/shared/EmptyCustom";
import { imageSearchAIStore } from "@/stores";
import { TJewelry } from "@/types";
import { useQueries } from "@tanstack/react-query";

import { projectStore } from "../store/productStore";

const { initPagination } = QUERY_CONST;
const ProductList: React.FC = () => {
	const query = projectStore((state) => state.query);
	const setQuery = projectStore((state) => state.setQuery);
	const image = imageSearchAIStore((state) => state.file);
	const [data, setData] = useState<TJewelry[]>([]);
	const [pagination, setPagination] = useState<PaginationProps>({
		...QUERY_CONST.initPagination,
		pageSize: 30,
		showSizeChanger: false,
	});
	const { updatePathname } = useRouterCustom();
	const [getJewelrys, getJewelrysCount, getJewelryAI] = useQueries({
		queries: [
			{
				queryKey: ["products", query],
				queryFn: () => jewelryService.get(query),
				enabled: false,
			},
			{
				queryKey: ["products-count", query],
				queryFn: () => jewelryService.getCount(query),
				enabled: false,
			},
			{
				queryKey: ["products-ai", image?.name],
				queryFn: () => imageSearchAIService.searchImage(image!),
				enabled: false,
				staleTime: 0,
			},
		],
	});

	useEffect(() => {
		getJewelrys.refetch();
		getJewelrysCount.refetch();
	}, [query]);
	useEffect(() => {
		if (getJewelrys.isSuccess) {
			setData(getJewelrys.data);
		}
		if (getJewelryAI.isSuccess) {
			setData(getJewelryAI.data);
		}
	}, [getJewelrys.data, getJewelryAI.data]);

	useEffect(() => {
		if (image) {
			getJewelryAI.refetch();
		}
	}, [image]);

	useEffect(() => {
		if (getJewelrysCount.data) {
			setPagination((pre) => ({ ...pre, total: getJewelrysCount.data }));
		}
	}, [getJewelrysCount.data]);
	const handleOnChangePagination: PaginationProps["onChange"] = (
		page: number,
		pageSize: number
	) => {
		console.log("🚀 ~ pageSize:", pageSize);
		console.log("🚀 ~ page:", page);
		setPagination((pre) => ({ ...pre, current: page }));
		updatePathname({ query: { page: page - 1 }, type: "replace" });
	};
	const isLoading = getJewelrys.isFetching || getJewelryAI.isFetching;

	if (isLoading) {
		return (
			<List
				grid={{
					gutter: 16,
					xs: 1,
					sm: 2,
					md: 4,
					lg: 4,
					xl: 5,
					xxl: 5,
				}}
				dataSource={Array.from({ length: 10 }, (_, index) => index + 1)}
				renderItem={(item, index) => (
					<List.Item key={index}>
						<Card
							className="flex flex-col justify-stretch overflow-hidden h-72"
							cover={
								<div className="h-40 max-h-40 overflow-hidden">
									<Skeleton.Image
										active
										className="w-full h-full"
									/>
								</div>
							}
						>
							<div className="flex justify-around items-center flex-col gap-4">
								<Skeleton active paragraph />
							</div>
						</Card>
					</List.Item>
				)}
			/>
		);
	}

	if (data.length === 0) {
		return <EmptyCustom />;
	}

	return (
		<div className="flex flex-col">
			<List
				grid={{
					gutter: 16,
					xs: 2,
					sm: 3,
					md: 4,
					lg: 4,
					xl: 5,
					xxl: 5,
				}}
				dataSource={data}
				renderItem={(item) => (
					<List.Item className="h-full" key={item.id}>
						<ProductCard jewelry={item} />
					</List.Item>
				)}
			/>
			{!image && (
				<Pagination
					align="center"
					{...pagination}
					onChange={handleOnChangePagination}
				/>
			)}
		</div>
	);
};

export default ProductList;
