import React from "react";

import { QUERY_CONST } from "@/const";
import { positionService } from "@/services";
import queryClientUtil from "@/utils/queryClientUtil";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { PositionList } from "./ui";

type Props = {};
const hydrate = async () => {
	const queryClient = queryClientUtil.getQueryClient();

	const { defaultQuery } = QUERY_CONST;
	await Promise.all([
		await queryClient.prefetchQuery({
			queryKey: ["positions", { ...defaultQuery }],
			queryFn: () => positionService.get(defaultQuery),
			staleTime: 5 * 60 * 1000,
		}),
		await queryClient.prefetchQuery({
			queryKey: ["positions-count", { ...defaultQuery }],
			queryFn: () => positionService.getCount(defaultQuery),
			staleTime: 5 * 60 * 1000,
		}),
	]);

	return dehydrate(queryClient);
};
const PositionPage: React.FC<Props> = ({}) => {
	return (
		<div>
			<HydrationBoundary state={hydrate()}>
				<PositionList />
			</HydrationBoundary>
		</div>
	);
};

export default PositionPage;
