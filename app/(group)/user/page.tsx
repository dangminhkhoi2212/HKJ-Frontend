import { Space } from "antd";
import React from "react";

import { QUERY_CONST } from "@/const";
import { materialService } from "@/services";
import queryClientUtil from "@/utils/queryClientUtil";
import { dehydrate } from "@tanstack/react-query";

import { ProductTrending, StorePicture, UserCarousel } from "./ui";
import Materials from "./ui/Materials";

const hydrate = async () => {
	const queryClient = queryClientUtil.getQueryClient();
	const { defaultQuery } = QUERY_CONST;

	await Promise.all([
		await queryClient.prefetchQuery({
			queryKey: ["material", defaultQuery],
			queryFn: () => materialService.get(defaultQuery),
		}),
	]);
	return dehydrate(queryClient);
};
const UserHomePage: React.FC<{}> = () => {
	return (
		<Space direction="vertical" className="flex" size={"large"}>
			<UserCarousel />
			<Materials />
			<ProductTrending />
			<StorePicture />
		</Space>
	);
};

export default UserHomePage;
