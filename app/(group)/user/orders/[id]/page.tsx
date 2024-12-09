import React from "react";

import { QUERY_CONST } from "@/const";
import { orderService } from "@/services";
import orderItemService from "@/services/orderItemService";
import { TOrderItemQuery, TQuery } from "@/types";
import queryClientUtil from "@/utils/queryClientUtil";
import { dehydrate } from "@tanstack/react-query";

import { OrderDetailForm } from "./ui";

type Props = { params: { id: string } };
const { defaultQuery } = QUERY_CONST;
const hydrate = async (id?: string) => {
	const queryClient = queryClientUtil.getQueryClient();
	const queryOrderItem: TQuery<TOrderItemQuery> = {
		...defaultQuery,
		orderId: { equals: id },
	};
	if (id) {
		await Promise.all([
			queryClient.prefetchQuery({
				queryKey: ["order", id],
				queryFn: () => orderService.getOne(id),
			}),
			queryClient.prefetchQuery({
				queryKey: ["order-count", id],
				queryFn: () => orderService.getOne(id),
			}),
			await queryClient.prefetchQuery({
				queryKey: ["order-items", id],
				queryFn: () => orderItemService.get(queryOrderItem),
			}),
		]);
	}

	return dehydrate(queryClient);
};
const OrderDetailPage: React.FC<Props> = ({ params: { id } }) => {
	return (
		<div className={"mx-4 md:mx-20"}>
			{/* <HydrationBoundary state={hydrate(id)}> */}
			<OrderDetailForm id={id} />
			{/* </HydrationBoundary> */}
		</div>
	);
};

export default OrderDetailPage;
