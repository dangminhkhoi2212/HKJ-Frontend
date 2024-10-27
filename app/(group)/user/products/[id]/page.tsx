import React from "react";

import { jewelryImageService, jewelryService } from "@/services";
import queryClientUtil from "@/utils/queryClientUtil";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { ProductDetailTemplate } from "./ui";

type Props = {
	params: {
		id: string;
	};
};
const hydrate = async (id: string) => {
	const queryClient = queryClientUtil.getQueryClient();

	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: ["products", id],
			queryFn: () => jewelryService.getOne(id),
		}),
		queryClient.prefetchQuery({
			queryKey: ["images", { jewelryModelId: { equals: id } }],
			queryFn: () => {
				jewelryImageService.get({
					jewelryModelId: { equals: id },
					isDeleted: { equals: false },
				});
			},
		}),
	]);

	return dehydrate(queryClient);
};
const ProductDetailPage: React.FC<Props> = async ({ params: { id } }) => {
	return (
		<HydrationBoundary state={await hydrate(id)}>
			<ProductDetailTemplate />
		</HydrationBoundary>
	);
};

export default ProductDetailPage;
