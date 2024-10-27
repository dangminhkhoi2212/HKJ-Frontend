import { Space } from "antd";
import React from "react";

import { QUERY_CONST } from "@/const";
import { jewelryService } from "@/services";
import queryClientUtil from "@/utils/queryClientUtil";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { ProductFilter, ProductList } from "./ui";

type Props = {};

const hydrate = async () => {
	const queryClient = queryClientUtil.getQueryClient();
	const { defaultQuery } = QUERY_CONST;

	await Promise.all([
		await queryClient.prefetchQuery({
			queryKey: ["products", defaultQuery],
			queryFn: () => jewelryService.get(defaultQuery),
		}),
		await queryClient.prefetchQuery({
			queryKey: ["products-count", defaultQuery],
			queryFn: () => jewelryService.get(defaultQuery),
		}),
	]);
	return dehydrate(queryClient);
};

const ProductsPage: React.FC<Props> = async ({}) => {
	return (
		<Space direction="vertical" className="flex">
			<ProductFilter />
			<HydrationBoundary state={await hydrate()}>
				<ProductList />
			</HydrationBoundary>
		</Space>
	);
};

export default ProductsPage;
