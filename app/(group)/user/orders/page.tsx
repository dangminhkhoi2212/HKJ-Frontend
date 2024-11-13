import { cookies } from "next/headers";
import React from "react";

import { KEY_CONST, QUERY_CONST } from "@/const";
import { orderService } from "@/services";
import { queryUtil } from "@/utils";
import queryClientUtil from "@/utils/queryClientUtil";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { OrderList } from "./ui";

type Props = {};
const { defaultQuery } = QUERY_CONST;
const { createSortOption } = queryUtil;
const hydrate = async (userId?: string) => {
	const queryClient = queryClientUtil.getQueryClient();
	const query = {
		...defaultQuery,
		sort: createSortOption("createdDate")?.desc,
	};
	if (userId)
		await Promise.all([
			queryClient.prefetchQuery({
				queryKey: ["order", query],
				queryFn: () => orderService.get(query),
			}),
			queryClient.prefetchQuery({
				queryKey: ["order-count", query],
				queryFn: () => orderService.get(query),
			}),
		]);
	return dehydrate(queryClient);
};
const OrdersPage: React.FC<Props> = ({}) => {
	const accountIDCookie = cookies().get(KEY_CONST.ACCOUNT_ID_COOKIE)?.value;

	return (
		<div className="flex justify-center">
			<HydrationBoundary state={hydrate(accountIDCookie)}>
				<OrderList />
			</HydrationBoundary>
		</div>
	);
};

export default OrdersPage;
