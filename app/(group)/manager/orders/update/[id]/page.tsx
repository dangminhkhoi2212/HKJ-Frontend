import React from "react";

import { QUERY_CONST } from "@/const";
import { orderImageService, orderService } from "@/services";
import { EmptyCustom } from "@/shared/EmptyCustom";
import { Frame } from "@/shared/Frame";
import queryClientUtil from "@/utils/queryClientUtil";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { HandleOrder } from "./ui";

type Props = { params: { id: string } };
const { defaultQuery } = QUERY_CONST;
const hydrate = async (id: string) => {
	const queryClient = queryClientUtil.getQueryClient();

	await Promise.all([
		await queryClient.prefetchQuery({
			queryKey: ["order", id],
			queryFn: () => orderService.getOne(id),
		}),

		await queryClient.prefetchQuery({
			queryKey: ["order-image", id],
			queryFn: () => orderImageService.get(defaultQuery),
		}),
	]);
	return dehydrate(queryClient);
};
const OrderDetailPage: React.FC<Props> = ({ params: { id } }) => {
	if (!id) return <EmptyCustom />;
	return (
		<Frame title="Cập nhật đơn hàng">
			<div className={"mx-4 sm:mx-20"}>
				<HydrationBoundary state={hydrate(id)}>
					<HandleOrder id={id} />
				</HydrationBoundary>
			</div>
		</Frame>
	);
};

export default OrderDetailPage;
