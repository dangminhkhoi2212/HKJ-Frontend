"use client";
import { Card } from "antd";
import React from "react";

import { QUERY_CONST } from "@/const";
import { jewelryService } from "@/services";
import categoryService from "@/services/categoryService";
import { Frame } from "@/shared/Frame";
import { TCategory, TJewelry, TJewelryQuery, TQuery } from "@/types";
import { queryUtil } from "@/utils";
import { useQueries, useQuery } from "@tanstack/react-query";

import CategoryTemplate from "./CategoryTemplate";

const { defaultQuery } = QUERY_CONST;

const buildQuery = (categoryId: string | number): TQuery<TJewelryQuery> => ({
	...defaultQuery,
	isDeleted: { equals: false },
	size: 4,
	categoryId: { equals: categoryId },
});
const { createSortOption } = queryUtil;
const CategoryIntro: React.FC = () => {
	const getCategory = useQuery({
		queryKey: ["category"],
		queryFn: () =>
			categoryService.get({
				...defaultQuery,
				size: 4,
				isDeleted: { equals: false },
				sort: createSortOption("id")?.desc,
				name: { in: ["Nhẫn", "Dây chuyền", "Bông tai", "Vòng tay"] },
			}),
	});

	const categoryIds =
		getCategory.data?.map((category: TCategory) => category.id) || [];

	const jewelryQueries = useQueries({
		queries: categoryIds.map((categoryId: number) => ({
			queryKey: [categoryId],
			queryFn: () => jewelryService.get(buildQuery(categoryId)),
			enabled: !!categoryId,
		})),
	});

	return (
		<Frame title="Sản phẩm nổi bật">
			<div className="flex flex-col gap-6 sm:mx-10 md:mx-20">
				{jewelryQueries.map((query, index) => (
					<Card
						key={index}
						className="p-2 sm:p-6 shadow-lg rounded-md hover:shadow-xl transition-all duration-300"
					>
						<CategoryTemplate
							isLoading={query.isLoading}
							jewelryModels={query?.data as TJewelry[]}
							category={getCategory.data[index]}
						/>
					</Card>
				))}
			</div>
		</Frame>
	);
};

export default CategoryIntro;
