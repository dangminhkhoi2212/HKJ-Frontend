import { cookies } from "next/headers";
import React from "react";

import { KEY_CONST, QUERY_CONST } from "@/const";
import { cartService } from "@/services";
import queryClientUtil from "@/utils/queryClientUtil";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { CartList } from "./ui";

type Props = {};
const { defaultQuery } = QUERY_CONST;
const hydrate = async (acocuntId: string) => {
	const queryClient = queryClientUtil.getQueryClient();
	const query = {
		...defaultQuery,
		customer: { equals: acocuntId },
	};
	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: ["products-cart", query],
			queryFn: () => cartService.get(query),
		}),
		queryClient.prefetchQuery({
			queryKey: ["products-cart-count", query],
			queryFn: () => {
				cartService.getCount(query);
			},
		}),
	]);

	return dehydrate(queryClient);
};
const CartPage: React.FC<Props> = ({}) => {
	const accountIDCookie = cookies().get(KEY_CONST.ACCOUNT_ID_COOKIE)?.value;
	if (!accountIDCookie) {
		return <p>Không tìm thấy khách hàng</p>;
	}
	return (
		<div>
			<HydrationBoundary state={hydrate(accountIDCookie)}>
				<CartList />
			</HydrationBoundary>
		</div>
	);
};

export default CartPage;
