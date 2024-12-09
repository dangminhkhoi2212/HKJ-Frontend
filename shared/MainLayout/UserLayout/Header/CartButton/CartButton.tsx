import { Badge, Button } from "antd";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

import { cartStore } from "@/app/(group)/user/cart/store";
import { getSupbaseInstance } from "@/config";
import { QUERY_CONST } from "@/const";
import { useAccountStore } from "@/providers";
import { routesUser } from "@/routes";
import { cartService } from "@/services";
import { TCartQuery, TQuery } from "@/types";
import { useQuery } from "@tanstack/react-query";

type Props = {};
const supabase = getSupbaseInstance();
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

	const handleRealtime = (payload: any) => {
		const data = payload.new;
		console.log("🚀 ~ handleRealtime ~ data:", data);
		if (data.customer_id === account?.id) {
			getCount.refetch();
		}
	};
	useEffect(() => {
		getCount.refetch();
	}, []);

	useEffect(() => {
		const channel = supabase.channel("notifications");

		channel
			.on(
				"postgres_changes",
				{ event: "INSERT", schema: "public", table: "hkj_cart" },
				(payload) => handleRealtime(payload)
			)
			.on(
				"postgres_changes",
				{ event: "UPDATE", schema: "public", table: "hkj_cart" },
				(payload) => handleRealtime(payload)
			)
			.subscribe();

		return () => {
			channel.unsubscribe();
		};
	}, []);
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
