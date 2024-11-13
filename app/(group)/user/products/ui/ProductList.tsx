"use client";
import { Card, List, Skeleton } from "antd";
import React, { useEffect, useState } from "react";

import { imageSearchAIService, jewelryService } from "@/services";
import { ProductCard } from "@/shared/CardCustom";
import { EmptyCustom } from "@/shared/EmptyCustom";
import { imageSearchAIStore } from "@/stores";
import { TJewelry } from "@/types";
import { useQueries } from "@tanstack/react-query";

import { projectStore } from "../store/ProdcutStore";

const ProductList: React.FC = () => {
	const query = projectStore((state) => state.query);
	const image = imageSearchAIStore((state) => state.file);
	const [data, setData] = useState<TJewelry[]>([]);

	const queries = useQueries({
		queries: [
			{
				queryKey: ["products", query, image?.name],
				queryFn: () => jewelryService.get(query),
				enabled: !image,
			},
			{
				queryKey: ["products-ai", query, image?.name],
				queryFn: () => imageSearchAIService.searchImage(image!),
				enabled: false,
				staleTime: 0,
			},
		],
	});

	const [getJewelrys, getJewelryAI] = queries;

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
	);
};

export default ProductList;
