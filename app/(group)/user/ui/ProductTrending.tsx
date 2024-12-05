"use client";
import { Card, List, Skeleton, Tag } from "antd";
import React from "react";

import { QUERY_CONST } from "@/const";
import { statisticService } from "@/services";
import { ProductCard } from "@/shared/CardCustom";
import { EmptyCustom } from "@/shared/EmptyCustom";
import { Frame } from "@/shared/Frame";
import { useQuery } from "@tanstack/react-query";

type Props = {};
const { defaultQuery } = QUERY_CONST;
const topTags: { [key: number]: JSX.Element } = {
	1: <Tag color="blue">Top 1</Tag>,
	2: <Tag color="cyan">Top 2</Tag>,
	3: <Tag color="green">Top 3</Tag>,
	4: <Tag color="pink">Top 4</Tag>,
	5: <Tag color="orange">Top 5</Tag>,
	6: <Tag color="yellow">Top 6</Tag>,
};
const ProductTrending: React.FC<Props> = ({}) => {
	const getProducts = useQuery({
		queryKey: ["product"],
		queryFn: () => statisticService.getTopProductOrder(),
	});

	if (getProducts.isLoading) {
		return (
			<List
				grid={{
					gutter: 16,
					xs: 2,
					sm: 3,
					md: 3,
					lg: 5,
					xl: 5,
				}}
				dataSource={Array.from({ length: 6 }, (_, index) => index + 1)}
				renderItem={(item, index) => (
					<List.Item key={index}>
						<Card
							className="flex flex-col justify-stretch overflow-hidden h-72 shadow-md hover:shadow-lg transition-shadow duration-300"
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
	if (!getProducts?.data?.length) {
		return <EmptyCustom />;
	}

	return (
		<Frame title="Đặt nhiều nhất">
			<div className="flex flex-col gap-4">
				<List
					grid={{
						gutter: 16,
						xs: 2,
						sm: 3,
						md: 3,
						lg: 5,
						xl: 5,
					}}
					dataSource={getProducts.data}
					renderItem={(item, index) => (
						<List.Item
							className="h-full flex flex-col gap-2 justify-center items-center"
							key={item.id}
						>
							<ProductCard jewelry={item} />
							{topTags[index + 1]}
						</List.Item>
					)}
				/>
			</div>
		</Frame>
	);
};

export default ProductTrending;
