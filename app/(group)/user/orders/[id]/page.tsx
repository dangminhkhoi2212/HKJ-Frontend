import React from "react";

import { QUERY_CONST } from "@/const";
import { orderImageService, orderService } from "@/services";
import queryClientUtil from "@/utils/queryClientUtil";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { OrderDetailForm } from "./ui";

type Props = { params: { id: string } };
const { defaultQuery } = QUERY_CONST;
const hydrate = async (id?: string) => {
	const queryClient = queryClientUtil.getQueryClient();

	if (id) {
		await Promise.all([
			queryClient.prefetchQuery({
				queryKey: ["order", id],
				queryFn: () => orderService.getOne(id),
			}),
		]);
		await queryClient.prefetchQuery({
			queryKey: ["order-image", id],
			queryFn: () => orderImageService.get(defaultQuery),
		});
	}
	return dehydrate(queryClient);
};
const OrderDetailPage: React.FC<Props> = ({ params: { id } }) => {
	return (
		<div className={"mx-4 md:mx-20"}>
			<HydrationBoundary state={hydrate(id)}>
				<OrderDetailForm id={id} />
			</HydrationBoundary>
		</div>
	);
};

export default OrderDetailPage;
