import { cookies } from "next/headers";
import React from "react";

import { KEY_CONST, QUERY_CONST } from "@/const";
import { orderService } from "@/services";
import queryClientUtil from "@/utils/queryClientUtil";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { OrderList, OrderTab } from "./ui";

type Props = {
	searchParams: { [key: string]: string | string[] | undefined };
};
const { defaultQuery } = QUERY_CONST;
const hydrate = async (userId?: string) => {
	const queryClient = queryClientUtil.getQueryClient();

	if (userId)
		await Promise.all([
			queryClient.prefetchQuery({
				queryKey: ["order", defaultQuery],
				queryFn: () => orderService.get(defaultQuery),
			}),
		]);
	return dehydrate(queryClient);
};
const OrdersPage: React.FC<Props> = ({ searchParams }) => {
	const accountIDCookie = cookies().get(KEY_CONST.ACCOUNT_ID_COOKIE)?.value;

	return (
		<div className="flex justify-center h-full">
			<div className="p-2 md:w-1/2 flex flex-col justify-center items-stretch  ">
				<div className="flex justify-center">
					<OrderTab />
				</div>
				<div className="grow overflow-auto  flex flex-col justify-center items-center">
					<HydrationBoundary state={hydrate(accountIDCookie)}>
						<OrderList />
					</HydrationBoundary>
				</div>
			</div>
		</div>
	);
};

export default OrdersPage;
