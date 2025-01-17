import { Space } from "antd";
import React from "react";

import { QUERY_CONST } from "@/const";
import { materialService } from "@/services";
import categoryService from "@/services/categoryService";
import queryClientUtil from "@/utils/queryClientUtil";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
	CategoryIntro,
	OrderIntro,
	ProductTrending,
	StorePicture,
	UserCarousel,
} from "./ui";
import Materials from "./ui/Materials";

const hydrate = async () => {
	const queryClient = queryClientUtil.getQueryClient();
	const { defaultQuery } = QUERY_CONST;

	await Promise.all([
		await queryClient.prefetchQuery({
			queryKey: ["material", defaultQuery],
			queryFn: () => materialService.get(defaultQuery),
		}),
		await queryClient.prefetchQuery({
			queryKey: ["category", { ...defaultQuery, size: 4 }],
			queryFn: () => categoryService.get({ ...defaultQuery, size: 4 }),
		}),
	]);
	return dehydrate(queryClient);
};
const UserHomePage: React.FC<{}> = () => {
	return (
		<HydrationBoundary state={hydrate()}>
			<Space direction="vertical" className="flex" size={"large"}>
				<UserCarousel />
				<OrderIntro />
				<Materials />
				<ProductTrending />
				<CategoryIntro />
				<StorePicture />
			</Space>
		</HydrationBoundary>
	);
};

export default UserHomePage;
