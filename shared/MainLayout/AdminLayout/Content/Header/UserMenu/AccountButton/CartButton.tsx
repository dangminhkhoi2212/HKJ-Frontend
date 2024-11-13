import { Badge, Button } from "antd";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

import { cartStore } from "@/app/(group)/user/cart/store";
import { QUERY_CONST } from "@/const";
import { useAccountStore } from "@/providers";
import { routesUser } from "@/routes";
import { cartService } from "@/services";
import { TCartQuery, TQuery } from "@/types";
import { useQuery } from "@tanstack/react-query";

type Props = {};

const CartButton: React.FC<Props> = ({}) => {
	const forceRefresh = cartStore((state) => state.forceRefresh);
	const setForceRefresh = cartStore((state) => state.setForceRefresh);
	const account = useAccountStore((state) => state.account);
	const [query, setQuery] = React.useState<TQuery<TCartQuery>>({
		...QUERY_CONST.defaultQuery,
		customerId: { equals: account?.id },
	});
	const getCount = useQuery({
		queryKey: ["product-cart-count", query],
		queryFn: () => cartService.getCount(query),
		staleTime: 0,
	});
	useEffect(() => {
		if (forceRefresh) {
			getCount.refetch();
		}
	}, [forceRefresh]);
	useEffect(() => {
		setQuery({
			...QUERY_CONST.defaultQuery,
			customerId: { equals: account?.id },
		});
	}, [account]);
	useEffect(() => {
		setForceRefresh(false);
	}, [getCount.data]);
	const quantity = getCount.data || 0;
	return (
		<div>
			<Link href={routesUser.cart}>
				<Badge count={quantity} size="default">
					<Button icon={<ShoppingCart size={14} />}></Button>
				</Badge>
			</Link>
		</div>
	);
};

export default CartButton;
