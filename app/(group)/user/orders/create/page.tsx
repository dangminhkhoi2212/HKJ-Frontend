import React from 'react';

import projectService from '@/services/projectService';
import queryClientUtil from '@/utils/queryClientUtil';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { CreateOrderBasicForm } from './ui';

type Props = {
	searchParams: { pId?: string };
};
const hydrate = async (productId?: string) => {
	const queryClient = queryClientUtil.getQueryClient();
	if (productId)
		await Promise.all([
			queryClient.prefetchQuery({
				queryKey: ["products", productId],
				queryFn: () => projectService.getOne(productId!),
			}),
		]);
	return dehydrate(queryClient);
};
const CreateOrderPage: React.FC<Props> = ({ searchParams }) => {
	return (
		<div className="">
			<HydrationBoundary state={hydrate(searchParams?.pId!)}>
				<CreateOrderBasicForm />
			</HydrationBoundary>
		</div>
	);
};

export default CreateOrderPage;
