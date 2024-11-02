import React from 'react';

import { jewelryImageService, jewelryService } from '@/services';
import { EmptyCustom } from '@/shared/EmptyCustom';
import queryClientUtil from '@/utils/queryClientUtil';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { ProductDetailTemplate } from './ui';

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
	if (!id) return <EmptyCustom />;
	return (
		<HydrationBoundary state={hydrate(id)}>
			<ProductDetailTemplate id={id} />
		</HydrationBoundary>
	);
};

export default ProductDetailPage;
